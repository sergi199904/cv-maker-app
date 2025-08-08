# CV Maker App

Una aplicación web moderna full-stack para crear, personalizar y descargar currículums profesionales. Construida con React, Node.js, Express y MongoDB.

## 🎯 Visión

CV Maker App empodera a usuarios sin conocimientos técnicos para crear CVs profesionales que les ayuden a conseguir el trabajo de sus sueños. Desde estudiantes hasta profesionales experimentados, nuestra plataforma ofrece una experiencia intuitiva y eficiente.

## ✨ Funcionalidades (MVP)

### Funcionalidades Principales
- **Autenticación de Usuario**: Sistema seguro de registro e inicio de sesión
- **Creación Guiada de CV**: Formulario paso a paso para datos personales, experiencia, educación y habilidades
- **Vista Previa en Tiempo Real**: Previsualización mientras el usuario edita el contenido
- **Selección de Plantillas**: Plantillas profesionales (incluye la plantilla Clásica)
- **Descarga en PDF**: Generación y descarga instantánea en PDF
- **Múltiples CVs**: Crear, editar y gestionar múltiples CVs

### Funcionalidades Premium (Estructura Lista)
- **Plantillas Premium**: Plantillas adicionales profesionales
- **Personalización Avanzada**: Colores, tipografías y opciones de layout
- **Múltiples Formatos de Exportación**: PDF, Word, etc.
- **Sugerencias con IA**: Recomendaciones de contenido (futuro)
- **Soporte Prioritario**: Atención al cliente mejorada

## 🛠 Stack Tecnológico

### Frontend
- **React 18** con Vite para desarrollo rápido
- **Tailwind CSS** para diseño moderno y responsive
- **React Router** para navegación
- **Zustand** para gestión de estado
- **React Hook Form** para manejo de formularios
- **Axios** para comunicación con la API

### Backend
- **Node.js** con Express
- **MongoDB** con Mongoose ODM
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **Express Validator** para validación de entradas
- **Puppeteer** para generación de PDF (listo para implementar)

## 📁 Estructura del Proyecto

```
cv-maker-app/
├── backend/                 # Servidor API Node.js/Express
│   ├── models/              # Modelos de datos MongoDB
│   │   ├── User.js          # Modelo de usuario con soporte de suscripción
│   │   └── CV.js            # Modelo de CV con todas las secciones
│   ├── routes/              # Rutas API
│   │   ├── auth.js          # Endpoints de autenticación
│   │   ├── cv.js            # Endpoints de gestión de CV
│   │   └── user.js          # Endpoints de perfil de usuario
│   ├── middleware/          # Middleware personalizado
│   │   └── auth.js          # Middleware de autenticación JWT
│   ├── config/              # Archivos de configuración
│   ├── utils/               # Funciones utilitarias
│   ├── server.js            # Configuración del servidor Express
│   └── package.json         # Dependencias del backend
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Componentes de rutas
│   │   ├── store/           # Gestión de estado (Zustand)
│   │   ├── services/        # Capa de servicios API
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilidades
│   │   └── styles/          # Estilos globales
│   ├── public/              # Recursos estáticos
│   └── package.json         # Dependencias del frontend
└── README.md                # Documentación del proyecto
```

## 🚀 Comenzando

### Requisitos Previos
- Node.js (v16 o superior)
- MongoDB (local o en la nube, ej. MongoDB Atlas)
- Gestor de paquetes npm o yarn

### Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd cv-maker-app
   ```

2. **Instalar todas las dependencias**
   ```bash
   npm run install:all
   ```

3. **Configurar Entornos**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edita .env con tu URI de MongoDB y tu JWT secret
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edita .env si es necesario (API URL debe apuntar al backend)
   ```

4. **Configurar Base de Datos**
   ```bash
   # Poblar plantillas (asegúrate que MongoDB está corriendo)
   npm run seed:templates
   ```

5. **Iniciar Servidores de Desarrollo**
   ```bash
   # Iniciar frontend y backend concurrentemente
   npm run dev
   
   # O iniciarlos por separado:
   # npm run dev:backend  # Backend en http://localhost:5000
   # npm run dev:frontend # Frontend en http://localhost:3000
   ```

6. **Acceder a la Aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Configuración Manual (Alternativa)

Si prefieres configurar cada parte manualmente:

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Configura tu archivo .env
node seed/templates.js  # Poblar plantillas
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Configura tu archivo .env
npm run dev
```

### Scripts de Desarrollo

**Nivel Root (Monorepo):**
- `npm run dev` - Inicia frontend y backend
- `npm run install:all` - Instala dependencias de todos los paquetes
- `npm run seed:templates` - Pobla la base de datos con plantillas
- `npm run build` - Construye el frontend para producción
- `npm run test` - Ejecuta tests frontend y backend

**Backend:**
- `npm run dev` - Servidor de desarrollo con nodemon
- `npm start` - Servidor de producción
- `npm test` - Tests del backend

**Frontend:**
- `npm run dev` - Desarrollo con Vite
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Ejecuta ESLint

## 📊 Modelos de Datos

### Modelo Usuario
- Información básica (firstName, lastName, email)
- Credenciales (password con hashing bcrypt)
- Gestión de suscripciones (subscriptionType: free, premium, enterprise)
- Límites y seguimiento de uso (cvLimit, downloadLimit, downloadsThisMonth)
- Flags de características premium (isPremium)

### Modelo CV
- **Información Personal**: firstName, lastName, title, summary, profileImage
- **Contacto**: email, phone, address, city, country, linkedin, github, portfolio, website
- **Experiencia Profesional**: Array con empresa, puesto, fechas, descripción
- **Educación**: Array con institución, grado, campo, fechas
- **Habilidades**: Array con nombre, nivel, categoría
- **Secciones Adicionales**: proyectos, certificaciones, idiomas (premium)
- **Plantilla y Tema**: selección de plantilla, esquema de color, tipografía
- **Analítica**: vistas, descargas, métricas de compartido

### Modelo Plantilla
- Metadatos (id, name, description, category)
- Clasificación premium (isPremium)
- Recursos de vista previa y estado activo

## 🔐 Autenticación & Autorización

- Autenticación basada en JWT
- Control de acceso por rol (usuarios free vs premium)
- Rutas y endpoints protegidos
- Manejo de refresco de token
- Hash seguro de contraseñas con bcrypt

## 💳 Estrategia de Monetización (Lista para Implementar)

### Modelo Freemium
- **Free**: 3 CVs, 1 plantilla básica, 5 descargas/mes
- **Premium**: CVs ilimitados, todas las plantillas, descargas ilimitadas
- **Enterprise**: Funcionalidades avanzadas, asistencia IA, soporte prioritario

### Fuentes de Ingreso
- Suscripciones mensuales/anuales
- Compra individual de plantillas
- Add-ons de funcionalidades premium
- Soluciones personalizadas enterprise

## 🚀 Mejoras Futuras

### Corto Plazo
- Implementación generación PDF
- Compartir CV por email
- Dashboard de analíticas
- Mejoras responsive móviles

### Medio Plazo
- Sugerencias de contenido con IA
- Plantillas específicas por industria
- Integración con redes sociales
- Edición colaborativa de CV

### Largo Plazo
- Soporte multi-idioma
- Creación de Video CV
- Herramientas de preparación de entrevistas
- Integración de matching de empleo

## 🔧 Variables de Entorno

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cv-maker-app
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CV Maker
```

## 🗃️ Configuración de la Base de Datos

### Configuración Inicial
1. Asegúrate de que MongoDB está corriendo
2. Ejecuta el seeder de plantillas:
   ```bash
   npm run seed:templates
   ```

Esto creará las siguientes plantillas:
- **Classic** (Free) - Layout tradicional con tipografía limpia
- **Modern** (Premium) - Diseño contemporáneo con acentos de color
- **Creative** (Premium) - Diseño llamativo para perfiles creativos
- **Minimal** (Premium) - Diseño limpio y enfocado en contenido
- **Executive** (Premium) - Plantilla profesional para puestos senior
- **Designer** (Premium) - Plantilla visualmente impactante para diseño

## 🤝 Contribuir

1. Haz fork del repositorio
2. Crea una rama de feature (`git checkout -b feature/mi-nueva-feature`)
3. Commit a tus cambios (`git commit -m 'Agrega nueva feature'`)
4. Haz push a la rama (`git push origin feature/mi-nueva-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia Apache 2.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

Para soporte, escribe a support@cvmaker.com o únete a nuestro canal de Slack.

---

Hecho con ❤️ para quienes buscan nuevas oportunidades profesionales
