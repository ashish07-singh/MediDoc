# 🚀 Deployment Guide

This guide will help you deploy your HMS project to production.

## 📋 Prerequisites

- GitHub repository set up
- Node.js 18+ installed
- MongoDB Atlas account
- Gmail account for OTP
- Vercel account (recommended)

## 🏗️ Build the Project

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 2. Build All Projects
```bash
# Build frontend and admin
npm run build

# Or build individually
npm run build:frontend
npm run build:admin
```

## 🌐 Deploy to Vercel (Recommended)

### Backend Deployment
1. **Go to [Vercel](https://vercel.com)**
2. **Import your GitHub repository**
3. **Select the `backend/` folder**
4. **Set environment variables:**
   ```env
   MONGODB_URI=mongodb+srv://Ashishsinghrawat649:Ashish649@cluster0.6reyati.mongodb.net
   JWT_SECRET=w7z!p$E&H)MbQeThWmZq4t7w!z$C&F)J
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=ayushjag30@gmail.com
   EMAIL_PASS=jyfxemkyquzqqdsp
   ```
5. **Deploy**

### Frontend Deployment
1. **Import repository again**
2. **Select the `frontend/` folder**
3. **Set environment variable:**
   ```env
   VITE_BACKEND_URL=https://your-backend-url.vercel.app
   ```
4. **Deploy**

### Admin Deployment
1. **Import repository again**
2. **Select the `admin/` folder**
3. **Set environment variable:**
   ```env
   VITE_BACKEND_URL=https://your-backend-url.vercel.app
   ```
4. **Deploy**

## 🚂 Deploy to Railway (Alternative)

### Backend Deployment
1. **Go to [Railway](https://railway.app)**
2. **Connect GitHub repository**
3. **Select backend folder**
4. **Set environment variables**
5. **Deploy**

## 🎯 Deploy to Render (Alternative)

### Backend Deployment
1. **Go to [Render](https://render.com)**
2. **Connect GitHub repository**
3. **Select backend folder**
4. **Set environment variables**
5. **Deploy**

## 🔧 Environment Variables Setup

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://Ashishsinghrawat649:Ashish649@cluster0.6reyati.mongodb.net
JWT_SECRET=w7z!p$E&H)MbQeThWmZq4t7w!z$C&F)J
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ayushjag30@gmail.com
EMAIL_PASS=jyfxemkyquzqqdsp
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
```

### Frontend (env.production)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Admin (env.production)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

## 📱 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads without errors
- [ ] Admin panel loads without errors
- [ ] Database connection works
- [ ] Email OTP system works
- [ ] All API endpoints respond
- [ ] CORS is properly configured
- [ ] Environment variables are set

## 🧪 Testing Production

### Test Backend
```bash
curl https://your-backend-domain.com/
# Should return: "API Working"
```

### Test Frontend
- Visit your frontend URL
- Try to register a doctor
- Check if OTP is received

### Test Admin
- Visit your admin URL
- Try to login as admin
- Check if dashboard loads

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update backend CORS settings
   - Add frontend/admin domains to allowed origins

2. **Environment Variables Not Loading**
   - Check if variables are set in deployment platform
   - Restart the service after setting variables

3. **Database Connection Failed**
   - Verify MongoDB URI
   - Check network access settings

4. **Email Not Working**
   - Verify Gmail App Password
   - Check if 2FA is enabled

## 📊 Monitoring

### Vercel Analytics
- Built-in performance monitoring
- Error tracking
- User analytics

### Railway/Render Monitoring
- Logs and error tracking
- Performance metrics
- Resource usage

## 🔄 Continuous Deployment

### Automatic Deployment
- Connect GitHub repository
- Deploy on every push to main branch
- Automatic environment variable updates

### Manual Deployment
```bash
# Build and deploy
npm run deploy
```

## 📞 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test locally first
4. Contact support team

---

**Happy Deploying! 🚀**
