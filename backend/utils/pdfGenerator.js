const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Genera un PDF a partir de los datos del CV
 * @param {Object} cvData - Datos del CV
 * @param {String} templateName - Nombre de la plantilla (classic, modern, etc.)
 * @returns {Buffer} - PDF en formato buffer
 */
async function generatePDF(cvData, templateName = 'classic') {
  let browser;
  
  try {
    // Cargar plantilla HTML
    const templatePath = path.join(__dirname, '../templates/cv', `${templateName}.html`);
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    
    // Reemplazar variables en la plantilla
    htmlTemplate = replaceTemplateVariables(htmlTemplate, cvData);
    
    // Lanzar navegador
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
    
    const page = await browser.newPage();
    
    // Establecer contenido HTML
    await page.setContent(htmlTemplate, {
      waitUntil: 'networkidle0'
    });
    
    // Generar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw new Error(`Error al generar PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Reemplaza variables en la plantilla HTML
 * @param {String} template - Template HTML
 * @param {Object} data - Datos del CV
 * @returns {String} - HTML con variables reemplazadas
 */
function replaceTemplateVariables(template, data) {
  let html = template;
  
  // Reemplazar variables simples {{variable}}
  html = html.replace(/\{\{firstName\}\}/g, data.firstName || '');
  html = html.replace(/\{\{lastName\}\}/g, data.lastName || '');
  html = html.replace(/\{\{title\}\}/g, data.title || '');
  html = html.replace(/\{\{summary\}\}/g, data.summary || '');
  html = html.replace(/\{\{email\}\}/g, data.contactInfo?.email || '');
  html = html.replace(/\{\{phone\}\}/g, data.contactInfo?.phone || '');
  html = html.replace(/\{\{address\}\}/g, data.contactInfo?.address || '');
  html = html.replace(/\{\{linkedin\}\}/g, data.contactInfo?.linkedin || '');
  html = html.replace(/\{\{github\}\}/g, data.contactInfo?.github || '');
  
  // Procesar bloques condicionales {{#if}}
  html = processConditionalBlocks(html, data);
  
  // Procesar loops {{#each}}
  html = processLoops(html, data);
  
  return html;
}

/**
 * Procesa bloques condicionales {{#if}}...{{/if}}
 */
function processConditionalBlocks(html, data) {
  // Pattern: {{#if variable}}...{{/if}}
  const ifPattern = /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  html = html.replace(ifPattern, (match, variable, content) => {
    const value = getNestedProperty(data, variable);
    return value ? content : '';
  });
  
  return html;
}

/**
 * Procesa loops {{#each}}...{{/each}}
 */
function processLoops(html, data) {
  // Experience
  if (data.experience && data.experience.length > 0) {
    const experienceHtml = data.experience.map(exp => `
      <div class="experience-item">
        <div class="item-header">
          <div class="item-title">${exp.position || ''}</div>
          <div class="item-date">${exp.startDate || ''} - ${exp.endDate || 'Presente'}</div>
        </div>
        <div class="item-subtitle">${exp.company || ''}</div>
        ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
      </div>
    `).join('');
    
    html = html.replace(/\{\{#each experience\}\}[\s\S]*?\{\{\/each\}\}/g, experienceHtml);
  } else {
    html = html.replace(/\{\{#if experience\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    const educationHtml = data.education.map(edu => `
      <div class="education-item">
        <div class="item-header">
          <div class="item-title">${edu.degree || ''}</div>
          <div class="item-date">${edu.startDate || ''} - ${edu.endDate || 'Presente'}</div>
        </div>
        <div class="item-subtitle">${edu.institution || ''}${edu.field ? ` • ${edu.field}` : ''}</div>
      </div>
    `).join('');
    
    html = html.replace(/\{\{#each education\}\}[\s\S]*?\{\{\/each\}\}/g, educationHtml);
  } else {
    html = html.replace(/\{\{#if education\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  }
  
  // Skills
  if (data.skills && data.skills.length > 0) {
    const skillsHtml = data.skills.map(skill => {
      const level = skill.level || 3;
      const filledDots = '●'.repeat(level);
      const emptyDots = '○'.repeat(5 - level);
      
      return `
        <div class="skill-item">
          <span class="skill-name">${skill.name || ''}</span>
          <div class="skill-level">
            <span>${filledDots}${emptyDots}</span>
          </div>
        </div>
      `;
    }).join('');
    
    html = html.replace(/\{\{#each skills\}\}[\s\S]*?\{\{\/each\}\}/g, skillsHtml);
  } else {
    html = html.replace(/\{\{#if skills\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  }
  
  return html;
}

/**
 * Obtiene una propiedad anidada de un objeto
 */
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

module.exports = {
  generatePDF
};
