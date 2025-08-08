# CV Maker App

A modern, full-stack web application for creating, customizing, and downloading professional CVs. Built with React, Node.js, Express, and MongoDB.

## 🎯 Vision

CV Maker App empowers users without technical knowledge to create professional CVs that help them land their dream jobs. From students to experienced professionals, our platform provides an intuitive, guided experience for building standout resumes.

## ✨ Features (MVP)

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Guided CV Creation**: Step-by-step form for personal data, experience, education, and skills
- **Real-time Preview**: Live preview of CV as users edit content
- **Template Selection**: Professional templates (Classic template included)
- **PDF Download**: Instant PDF generation and download
- **Multiple CVs**: Create, edit, and manage multiple CVs

### Premium Features (Structure Ready)
- **Premium Templates**: Additional professional templates
- **Advanced Customization**: Colors, fonts, and layout options
- **Multiple Export Formats**: PDF, Word, etc.
- **AI-Powered Suggestions**: Content recommendations (future)
- **Priority Support**: Enhanced customer support

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive design
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling
- **Axios** for API communication

### Backend
- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Puppeteer** for PDF generation (ready for implementation)

## 📁 Project Structure

```
cv-maker-app/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB data models
│   │   ├── User.js        # User model with subscription support
│   │   └── CV.js          # CV model with all sections
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── cv.js          # CV management endpoints
│   │   └── user.js        # User profile endpoints
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   ├── server.js         # Express server setup
│   └── package.json      # Backend dependencies
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── store/        # Zustand state management
│   │   ├── services/     # API service layer
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # Global styles
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cv-maker-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Frontend environment  
   cd ../frontend
   cp .env.example .env
   # Edit .env if needed (API URL should match backend)
   ```

4. **Database Setup**
   ```bash
   # Seed templates (make sure MongoDB is running)
   npm run seed:templates
   ```

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start them separately:
   # npm run dev:backend  # Backend on http://localhost:5000
   # npm run dev:frontend # Frontend on http://localhost:3000
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup (Alternative)

If you prefer to set up each part manually:

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
node seed/templates.js  # Seed templates
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

### Development Scripts

**Root Level (Monorepo):**
- `npm run dev` - Start both frontend and backend concurrently
- `npm run install:all` - Install dependencies for all packages
- `npm run seed:templates` - Seed database with CV templates
- `npm run build` - Build frontend for production
- `npm run test` - Run tests for both frontend and backend

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run backend tests

**Frontend:**
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Data Models

### User Model
- Basic profile information (firstName, lastName, email)
- Authentication credentials (password with bcrypt hashing)
- Subscription management (subscriptionType: free, premium, enterprise)
- Usage limits and tracking (cvLimit, downloadLimit, downloadsThisMonth)
- Premium features flags (isPremium)

### CV Model
- **Personal Information**: firstName, lastName, title, summary, profileImage
- **Contact Details**: email, phone, address, city, country, linkedin, github, portfolio, website
- **Professional Experience**: Array of experience entries with company, position, dates, description
- **Education History**: Array of education entries with institution, degree, field, dates
- **Skills Categorization**: Array of skills with name, level, category
- **Additional Sections**: projects, certifications, languages (premium features)
- **Template and Theme**: template selection, color scheme, typography
- **Analytics**: views, downloads, sharing metrics

### Template Model
- Template metadata (id, name, description, category)
- Premium tier classification (isPremium)
- Preview assets and active status

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (free vs premium users)
- Protected routes and API endpoints
- Automatic token refresh handling
- Secure password hashing with bcrypt

## 💳 Monetization Strategy (Ready for Implementation)

### Freemium Model
- **Free Tier**: 3 CVs, 1 basic template, 5 downloads/month
- **Premium Tier**: Unlimited CVs, all templates, unlimited downloads
- **Enterprise Tier**: Advanced features, AI assistance, priority support

### Revenue Streams
- Monthly/yearly subscriptions
- One-time template purchases
- Premium feature add-ons
- Enterprise custom solutions

## 🚀 Future Enhancements

### Short Term
- PDF generation implementation
- Email CV sharing
- CV analytics dashboard
- Mobile responsive improvements

### Medium Term
- AI-powered content suggestions
- Industry-specific templates
- Social media integration
- Collaborative CV editing

### Long Term
- Multi-language support
- Video CV creation
- Interview preparation tools
- Job matching integration

## 🔧 Environment Variables

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

## 🗃️ Database Setup

### Initial Setup
1. Make sure MongoDB is running on your system
2. Run the template seeder to populate initial templates:
   ```bash
   npm run seed:templates
   ```

This will create the following templates:
- **Classic** (Free) - Traditional CV layout with clean typography
- **Modern** (Premium) - Contemporary design with color accents  
- **Creative** (Premium) - Eye-catching design for creative professionals
- **Minimal** (Premium) - Clean and minimal design focused on content
- **Executive** (Premium) - Professional template for senior positions
- **Designer** (Premium) - Visually striking template for design professionals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@cvmaker.com or join our Slack channel.

---

**Made with ❤️ for job seekers worldwide**