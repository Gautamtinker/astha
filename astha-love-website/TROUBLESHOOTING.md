# Troubleshooting Guide - Backend Connection Issues

## Problem: "Could not load notes. Make sure the backend server is running."

### Step 1: Check the Backend URL Format

The most common issue is the URL format. The URL **must** include `/api` at the end.

✅ **Correct:** `https://astha-backend-alpha.vercel.app/api`
❌ **Wrong:** `https://astha-backend-alpha.vercel.app/`
❌ **Wrong:** `https://astha-backend-alpha.vercel.app`

### Step 2: Test Your Backend URL

Open your browser and visit:

```
https://astha-backend-alpha.vercel.app/api/health
```

You should see:

```json
{ "success": true, "message": "Server is running! ❤️", "timestamp": "..." }
```

If you see this, your backend is working!

### Step 3: Check CORS Settings

The backend must allow requests from your frontend domain.

**In your backend `.env` file:**

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

Make sure:

- No trailing slash: `https://your-frontend.vercel.app` ✓
- With trailing slash: `https://your-frontend.vercel.app/` ✗

### Step 4: Update Frontend Environment Variable

Create a `.env` file in your frontend root:

```env
VITE_API_URL=https://astha-backend-alpha.vercel.app/api
```

Then rebuild and redeploy:

```bash
npm run build
```

### Step 5: Check Browser Console

1. Open your website
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for errors

You should see:

```
Fetching notes from: https://astha-backend-alpha.vercel.app/api/notes
```

If you see CORS errors, update your backend CORS settings.

### Step 6: Common Issues

#### Issue: 404 Not Found

- URL is missing `/api`
- Backend route is wrong

#### Issue: CORS Error

- Backend `CORS_ORIGIN` doesn't match frontend URL
- Need to redeploy backend after changing CORS

#### Issue: Network Error

- Backend is not running
- MongoDB connection failed
- Wrong URL

### Step 7: Quick Fix

1. **Update your backend `.env`:**

   ```env
   CORS_ORIGIN=*
   ```

   (This allows all origins - use for testing only)

2. **Redeploy backend**

3. **Update frontend `.env`:**

   ```env
   VITE_API_URL=https://astha-backend-alpha.vercel.app/api
   ```

4. **Redeploy frontend**

5. **Clear browser cache and try again**

### Still Not Working?

Run these commands and share the output:

```bash
# Test backend health
curl https://astha-backend-alpha.vercel.app/api/health

# Test notes endpoint
curl https://astha-backend-alpha.vercel.app/api/notes
```

### Alternative: Use Render Instead of Vercel for Backend

Vercel is designed for static sites, not Node.js backends. Consider deploying your backend on:

- **Render.com** (free, easy)
- **Railway.app** (free tier)
- **Heroku** (paid)

These platforms are better suited for Node.js + MongoDB applications.
