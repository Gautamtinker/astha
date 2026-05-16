# Serverless Backend Setup Guide

## Overview

Your backend has been converted to Vercel Serverless Functions. This means:

- No persistent server needed
- Functions run on demand
- Automatic scaling
- Free tier available

## Files Created

```
astha-love-website/
├── api/
│   ├── notes.js      # Main API for notes CRUD
│   └── health.js     # Health check endpoint
├── vercel.json       # Vercel configuration
└── ...
```

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Convert backend to Vercel serverless functions"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your repository (or update existing deployment)
3. Vercel will automatically detect the `api/` folder

### Step 3: Add MongoDB Connection String

1. In Vercel project settings, go to **Environment Variables**
2. Add a new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string from Atlas
   - **Environment**: Production

### Step 4: Redeploy

After adding the environment variable, trigger a new deployment.

## Testing

Once deployed, test these endpoints:

1. **Health Check**:

   ```
   https://your-domain.vercel.app/api/health
   ```

2. **Get All Notes**:

   ```
   https://your-domain.vercel.app/api/notes
   ```

3. **Create Note** (POST):
   ```
   https://your-domain.vercel.app/api/notes
   Body: { "title": "Test", "content": "Hello" }
   ```

## API Endpoints

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | `/api/health`       | Health check    |
| GET    | `/api/notes`        | Get all notes   |
| GET    | `/api/notes?id=123` | Get single note |
| POST   | `/api/notes`        | Create note     |
| PUT    | `/api/notes?id=123` | Update note     |
| DELETE | `/api/notes?id=123` | Delete note     |

## Important Notes

1. **CORS**: Serverless functions have CORS enabled by default (`*`)
2. **Cold Start**: First request may take 1-2 seconds
3. **Timeout**: Functions have a 10-second timeout
4. **MongoDB Connection**: Connection is reused between invocations

## Troubleshooting

### "Cannot GET /api/health"

- Make sure you deployed the `api/` folder
- Check Vercel function logs

### MongoDB Connection Error

- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas network access (whitelist `0.0.0.0/0`)

### CORS Errors

- The functions already have CORS headers set
- Check browser console for details

## Local Testing

To test locally:

```bash
npm install -g vercel
vercel dev
```

Then visit `http://localhost:3000/api/health`
