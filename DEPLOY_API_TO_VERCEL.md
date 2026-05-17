# Deploy API from This Repository to Vercel

## Step 1: Push Your Code to GitHub

Make sure all the API files are committed and pushed:

```bash
git add .
git commit -m "Add serverless API functions for backend"
git push origin main
```

## Step 2: Deploy to Vercel

### Option 1: Deploy as New Project (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (`Gautamtinker/astha`)
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **DO NOT deploy yet!** Click **"Deploy"** but we need to add environment variables first.

### Option 2: Update Existing Project

If you already have a Vercel project for this repository:

1. Go to your project settings
2. Go to **"Git"** → **"Connected Git Repository"**
3. Make sure it's connected to `Gautamtinker/astha`

## Step 3: Add Environment Variables

In your Vercel project settings:

1. Go to **"Settings"** → **"Environment Variables"**
2. Add these variables:

   **For Production:**

   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/astha-love-website?retryWrites=true&w=majority
   ```

   **For Development (optional):**

   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/astha-love-website?retryWrites=true&w=majority
   ```

3. Click **"Save"**

## Step 4: Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"Redeploy"** (or push a new commit to trigger auto-deploy)

## Step 5: Test Your API

Once deployed, test these endpoints:

1. **Test endpoint**:

   ```
   https://your-project.vercel.app/api/test
   ```

2. **Health check**:

   ```
   https://your-project.vercel.app/api/health
   ```

3. **Notes API**:
   ```
   https://your-project.vercel.app/api/notes
   ```

## Step 6: Update Frontend Configuration

Update your `.env` file with the new backend URL:

```env
VITE_API_URL=https://your-project.vercel.app
```

## Step 7: Test the Love Notebook

1. Open your frontend
2. Go to the Love Notebook section
3. Try creating a note
4. It should now sync with the backend!

## Troubleshooting

### "Cannot GET /api/test"

- The API functions haven't deployed yet
- Check Vercel deployment logs
- Make sure `vercel.json` is in the root

### MongoDB Connection Error

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (whitelist `0.0.0.0/0`)
- Ensure username and password are URL-encoded

### CORS Errors

- The API functions already have CORS headers
- Make sure you're using the same domain for frontend and backend

## Important Notes

1. **Single Project**: Both frontend and backend are now in the same Vercel project
2. **Environment Variables**: Must be added in Vercel, not just in `.env` file
3. **Auto Deploy**: Any push to `main` branch will trigger a new deployment
4. **Free Tier**: Vercel free tier includes 100GB bandwidth/month

## Success Indicators

✅ `https://your-project.vercel.app/api/test` returns `{"success": true, "message": "Serverless function is working! 🚀"}`

✅ `https://your-project.vercel.app/api/health` returns `{"success": true, "message": "Astha Love Website API is running! ❤️"}`

✅ Love Notebook can create and retrieve notes

✅ Notes sync across different devices
