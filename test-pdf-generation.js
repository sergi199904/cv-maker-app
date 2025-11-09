/**
 * Script de Testing Independiente - Generación de PDF
 * No requiere MongoDB ni servidor corriendo
 */

const path = require('path');
const fs = require('fs').promises;

// Simular el servicio de generación de PDF
async function testPDFGeneration() {
  console.log('🧪 Iniciando test de generación de PDF...\n');
  
  try {
    // 1. Verificar que el generador existe
    const pdfGeneratorPath = path.join(__dirname, 'backend/utils/pdfGenerator.js');
    console.log('✓ Verificando pdfGenerator.js...');
    await fs.access(pdfGeneratorPath);
    console.log('  ✅ Archivo encontrado\n');
    
    // 2. Verificar template HTML
    const templatePath = path.join(__dirname, 'backend/templates/cv/classic.html');
    console.log('✓ Verificando template classic.html...');
    await fs.access(templatePath);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    console.log('  ✅ Template cargado (' + templateContent.length + ' bytes)\n');
    
    // 3. Importar el generador
    console.log('✓ Importando módulo pdfGenerator...');
    const { generatePDF } = require('./backend/utils/pdfGenerator.js');
    console.log('  ✅ Módulo importado correctamente\n');
    
    // 4. Datos de prueba
    console.log('✓ Creando datos de prueba...');
    const testCVData = {
      firstName: 'Sergio',
      lastName: 'Oyarzo',
      title: 'Full Stack Developer',
      summary: 'Desarrollador apasionado con experiencia en React, Node.js y MongoDB. Especializado en crear aplicaciones web modernas y escalables.',
      contactInfo: {
        email: 'sergio@example.com',
        phone: '+56 9 9843 5160',
        address: 'Santiago, Chile',
        linkedin: 'linkedin.com/in/sergiooyarzo',
        github: 'github.com/sergi199904'
      },
      experience: [
        {
          position: 'Full Stack Developer',
          company: 'Tech Company',
          startDate: '2023-01',
          endDate: 'Presente',
          description: 'Desarrollo de aplicaciones web usando React, Node.js y MongoDB. Implementación de features como generación de PDFs, autenticación JWT y diseño responsive.'
        },
        {
          position: 'Junior Developer',
          company: 'Startup XYZ',
          startDate: '2021-06',
          endDate: '2022-12',
          description: 'Desarrollo frontend con React y colaboración en proyectos backend con Express.'
        }
      ],
      education: [
        {
          degree: 'Ingeniería en Informática',
          institution: 'Universidad de Chile',
          field: 'Ciencias de la Computación',
          startDate: '2018',
          endDate: '2022'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 5 },
        { name: 'React', level: 5 },
        { name: 'Node.js', level: 4 },
        { name: 'MongoDB', level: 4 },
        { name: 'Python', level: 3 },
        { name: 'Docker', level: 3 }
      ]
    };
    console.log('  ✅ Datos creados\n');
    
    // 5. Generar PDF
    console.log('✓ Generando PDF...');
    console.log('  ⏳ Esto puede tardar unos segundos...\n');
    
    const pdfBuffer = await generatePDF(testCVData, 'classic');
    
    console.log('  ✅ PDF generado exitosamente!');
    console.log('  📊 Tamaño: ' + (pdfBuffer.length / 1024).toFixed(2) + ' KB\n');
    
    // 6. Guardar PDF de prueba
    const outputPath = path.join(__dirname, 'TEST_CV_Sergio_Oyarzo.pdf');
    await fs.writeFile(outputPath, pdfBuffer);
    console.log('✓ PDF guardado en:');
    console.log('  📄 ' + outputPath + '\n');
    
    // 7. Resumen
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ TEST COMPLETADO CON ÉXITO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Resumen:');
    console.log('   • Generador PDF: ✅ Funcional');
    console.log('   • Template HTML: ✅ Cargado');
    console.log('   • Puppeteer: ✅ Operativo');
    console.log('   • Archivo PDF: ✅ Creado');
    console.log('');
    console.log('🎉 ¡El sistema de generación de PDF funciona correctamente!');
    console.log('');
    console.log('Para ver el PDF ejecuta:');
    console.log('   xdg-open ' + outputPath);
    console.log('');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('');
    console.error('Detalles del error:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar test
testPDFGeneration();
