# Deployment Guide - Astha Love Website

## Overview

This project has two parts:

1. **Frontend** (React + Vite) - Deployed on Vercel
2. **Backend** (Node.js + Express + MongoDB) - Deployed on Render/Railway

**Important**: You cannot deploy the Node.js backend on Vercel because Vercel is designed for static sites and serverless functions. The backend needs a persistent server for MongoDB connections.

## 📦 Part 1: Deploy Backend (Choose One Option)

### Option A: Render.com (Recommended - Free)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Add backend server"
   git push origin main
   ```

2. **Go to [Render.com](https://render.com)**
   - Sign up/Login
   - Click "New +" → "Web Service"

3. **Connect your repository**
   - Select your GitHub repository
   - Configure:
     - **Name**: astha-love-backend
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Click "Environment" → "Add Environment Variable"
   - Add:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     CORS_ORIGIN=https://your-frontend.vercel.app
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://astha-love-backend.onrender.com`)

### Option B: Railway.app (Free)

1. **Go to [Railway.app](https://railway.app)**
2. **Deploy from GitHub**
3. **Add MongoDB plugin**
4. **Set environment variables**
5. **Deploy**

### Option C: Self-hosted (VPS)

Use a VPS like DigitalOcean, AWS, or Heroku alternative.

---

## 📱 Part 2: Deploy Frontend on Vercel

1. **Go to [Vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub

2. **Import your repository**
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   - Click "Environment Variables" → "Add Variable"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url` with your actual backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Your frontend URL: `https://astha-love-website.vercel.app`

---

## 🔗 Part 3: Connect Frontend & Backend

### Update CORS Settings on Backend

After deploying, update your backend's CORS settings:

1. Go to your Render/Railway dashboard
2. Update `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://astha-love-website.vercel.app
   ```
3. Redeploy the backend (or it may auto-redeploy)

### Test the Connection

1. Visit your Vercel frontend URL
2. Go to the Love Notebook page
3. Try adding a note
4. Check if it appears and syncs

---

## 📝 Part 4: Update .env Files

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/astha-love-website
PORT=5000
CORS_ORIGIN=https://astha-love-website.vercel.app
```

---

## 🔄 Updating After Changes

### Frontend Updates

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will auto-deploy!

### Backend Updates

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render/Railway will auto-deploy!

---

## 🛠️ Troubleshooting

### Notes Not Syncing?

1. **Check Backend URL**
   - Make sure `VITE_API_URL` in Vercel matches your backend URL
   - Must end with `/api`

2. **Check CORS Settings**
   - Backend `CORS_ORIGIN` must match your Vercel URL exactly
   - No trailing slash: `https://astha-love-website.vercel.app` ✓
   - With trailing slash: `https://astha-love-website.vercel.app/` ✗

3. **Test Backend Directly**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should show: `{"success": true, "message": "Server is running! ❤️"}`

4. **Check MongoDB Connection**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas cluster is running
   - Whitelist all IPs: `0.0.0.0/0` in MongoDB Atlas

### Backend Not Starting?

1. Check Render/Railway logs
2. Verify all dependencies are installed
3. Check environment variables are set correctly

### Frontend Not Building?

1. Check Vercel build logs
2. Verify `VITE_API_URL` is set
3. Clear cache and redeploy

---

## 💡 Tips

1. **Free Tier Limits**
   - Render: 750 hours/month free (enough for one service)
   - Railway: $5/month credit (enough for small apps)
   - MongoDB Atlas: 512MB storage free

2. **Performance**
   - Backend may sleep on free tier (first request takes 30s)
   - Consider upgrading for better performance

3. **Security**
   - Never commit `.env` files
   - Keep MongoDB credentials secret
   - Use HTTPS for all connections

---

## 📞 Need Help?

If you face issues:

1. Check the deployment logs
2. Verify all environment variables
3. Test backend API directly
4. Check browser console for errors

Good luck! Your love website will be live and notes will sync across all devices! 💕
