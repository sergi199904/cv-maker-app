# 🚀 Quick Start - CV Maker App

**¡Tu aplicación de CVs ya está casi lista!** 🎉

---

## ✨ Mejoras Recientes (Nov 9, 2025)

- ✅ **Generación de PDF** implementada con Puppeteer
- ✅ **Preview en tiempo real** del CV
- ✅ **Template Classic** profesional
- ✅ **API completa** de descarga

**Estado:** 90% completo - ¡MVP listo para testing!

---

## ⚡ Iniciar el Proyecto (3 pasos)

### 1. **Instalar Dependencias**
```bash
npm run install:all
```

### 2. **Configurar MongoDB**
```bash
# Asegúrate que MongoDB esté corriendo
sudo systemctl start mongod

# Poblar plantillas
npm run seed:templates
```

### 3. **Iniciar Servidores**
```bash
# Frontend + Backend simultáneamente
npm run dev
```

🌐 **URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🧪 Probar Generación de PDF

### Opción 1: Interfaz Web
1. Registrarte en http://localhost:3000/register
2. Crear nuevo CV
3. Llenar información
4. Click en "Download PDF" 📥

### Opción 2: API Directa
```bash
# 1. Login y obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tupassword"}'

# 2. Descargar PDF
curl -X POST http://localhost:5000/api/cv/{cvId}/download \
  -H "Authorization: Bearer {TOKEN}" \
  -o mi_cv.pdf

# 3. Abrir PDF
xdg-open mi_cv.pdf
```

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `MEJORAS_IMPLEMENTADAS.md` | 📋 Documentación completa |
| `backend/utils/pdfGenerator.js` | 🔧 Servicio de PDF |
| `backend/templates/cv/classic.html` | 📄 Template HTML |
| `frontend/src/components/CVPreview.jsx` | 👁️ Preview component |
| `frontend/src/services/downloadService.js` | ⬇️ Servicio descarga |

---

## 🎯 Próximos Pasos Sugeridos

### Fase 1: Testing (Ahora) ✅
- [ ] Probar registro/login
- [ ] Crear CV de prueba
- [ ] Descargar PDF
- [ ] Verificar límites free user

### Fase 2: Más Templates 🎨
- [ ] Template Modern
- [ ] Template Creative
- [ ] Template Minimal

### Fase 3: Mejoras Editor ✏️
- [ ] Drag & drop secciones
- [ ] Rich text editor
- [ ] Upload foto perfil

### Fase 4: Deploy 🚀
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configurar MongoDB Atlas

---

## 🐛 Troubleshooting

### Error: MongoDB no conecta
```bash
# Verificar que está corriendo
sudo systemctl status mongod

# Iniciar si no está activo
sudo systemctl start mongod
```

### Error: Puppeteer no encuentra Chromium
```bash
# Instalar Chromium
sudo apt install chromium-browser

# O actualizar .env
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Error: Puerto 5000 en uso
```bash
# Cambiar puerto en backend/.env
PORT=5001
```

---

## 📞 Ayuda

**Documentación completa:** Ver `MEJORAS_IMPLEMENTADAS.md`

**GitHub:** https://github.com/sergi199904/cv-maker-app

---

¡Happy coding! 💻✨
