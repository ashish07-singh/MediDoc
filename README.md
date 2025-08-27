# 🏥 Hospital Management System (HMS)

A comprehensive full-stack hospital consultation platform with real-time chat-based consultations.

## 🚀 Features

- **Patient Portal**: Book consultations, chat with doctors
- **Doctor Portal**: Manage patients, consultations, and profiles
- **Admin Panel**: Oversee doctors, consultations, and system
- **Real-time Chat**: Secure patient-doctor communication
- **OTP Verification**: Secure email-based authentication
- **Responsive Design**: Works on all devices

## 🏗️ Architecture

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite
- **Admin**: React + Vite
- **Database**: MongoDB Atlas
- **Email**: Nodemailer + Gmail
- **File Storage**: Cloudinary

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, JWT, Nodemailer
- **Frontend**: React, Vite, Tailwind CSS
- **Database**: MongoDB Atlas
- **Authentication**: JWT with OTP verification
- **Real-time**: WebSocket-based chat system

## 📁 Project Structure

```
HMS/
├── backend/          # Node.js API server
│   ├── controllers/  # API controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── config/       # Configuration files
│   └── utils/        # Utility functions
├── frontend/         # Patient portal (React)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── assets/       # Static assets
├── admin/            # Admin/Doctor panel (React)
│   ├── src/
│   │   ├── components/  # Admin components
│   │   ├── pages/       # Admin pages
│   │   └── context/     # Admin context
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account for OTP

### Installation
```bash
# Clone repository
git clone https://github.com/ashish07-singh/MediDoc.git
cd MediDoc

# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/env.production backend/.env
# Edit backend/.env with your credentials

# Start development servers
npm run dev
```

## 🌐 Live Demo

- **Frontend**: [Patient Portal](https://your-frontend-domain.com)
- **Admin**: [Admin Panel](https://your-admin-domain.com)
- **API**: [Backend API](https://your-backend-domain.com)

## 📱 Screenshots

[Add screenshots here]

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
```

### Frontend (env.production)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Admin (env.production)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy backend service

### Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy all services

## 📋 API Endpoints

### Authentication
- `POST /api/user/login` - User login
- `POST /api/user/register/request-otp` - User registration OTP
- `POST /api/doctor/login` - Doctor login
- `POST /api/doctor/register/request-otp` - Doctor registration OTP
- `POST /api/admin/login` - Admin login

### Doctors
- `GET /api/doctor/list` - Get all doctors
- `GET /api/doctor/profile` - Get doctor profile
- `PATCH /api/doctor/profile` - Update doctor profile

### Consultations
- `GET /api/chats` - Get user chats
- `POST /api/chats/start` - Start consultation
- `POST /api/chats/reply` - Reply to chat

## 🧪 Testing

```bash
# Test backend
cd backend
npm test

# Test frontend
cd frontend
npm test

# Test admin
cd admin
npm test
```

## 📄 License

This project is proprietary - client project.

## 👨‍💻 Author

**Ashish Singh Rawat**
- GitHub: [@ashish07-singh](https://github.com/ashish07-singh)
- Email: ashishsinghrawat649@gmail.com

## 🆘 Support

For technical support or questions:
- Email: ashishsinghrawat649@gmail.com
- GitHub Issues: [Create Issue](https://github.com/ashish07-singh/MediDoc/issues)

## 🔄 Contributing

This is a client project. For support, please contact the author.

## 📊 Project Status

- ✅ Backend API - Complete
- ✅ Frontend Patient Portal - Complete
- ✅ Admin Panel - Complete
- ✅ Database Models - Complete
- ✅ Authentication System - Complete
- ✅ Real-time Chat - Complete
- 🚧 Deployment - In Progress
- 🚧 Documentation - In Progress

## 🎯 Roadmap

- [ ] Add video consultations
- [ ] Implement payment gateway
- [ ] Add prescription management
- [ ] Create mobile app
- [ ] Add analytics dashboard

## 📈 Performance

- **Frontend**: Optimized with Vite
- **Backend**: RESTful API with JWT
- **Database**: MongoDB Atlas with indexing
- **Real-time**: WebSocket for instant messaging

---

**Built with ❤️ by Ashish Singh Rawat**


