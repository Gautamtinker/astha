# MongoDB Setup Guide

## Step 1: Get Your MongoDB Connection String

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com
   - Log in to your account

2. **Find Your Cluster**
   - Click on your cluster (usually named `cluster0`)

3. **Get Connection String**
   - Click the **"Connect"** button
   - Select **"Connect your application"**
   - Choose **"Driver: Node.js"** and **"Version: 5.5 or later"**
   - Copy the connection string

4. **Replace Placeholders**
   - Replace `<password>` with your database user password
   - Replace `<username>` with your database username

## Step 2: Update .env File

Open the `.env` file and paste your connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/astha-love-website?retryWrites=true&w=majority
```

## Step 3: Whitelist IP Address (Important!)

1. In MongoDB Atlas, go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development, use:
   - **IP Address**: `0.0.0.0/0` (allows all IPs)
4. Click **"Confirm"**

## Step 4: Test Connection

After updating the `.env` file:

1. **For local testing**:

   ```bash
   npm install -g vercel
   vercel dev
   ```

   Then visit: `http://localhost:3000/api/health`

2. **For deployed version**:
   - Push your code to GitHub
   - Deploy to Vercel
   - Add `MONGODB_URI` as environment variable in Vercel settings

## Common Issues

### "ENOTFOUND \_mongodb.\_tcp.cluster0..."

- Your connection string is incorrect
- Double-check the cluster URL

### "Bad authentication"

- Username or password is wrong
- Special characters in password need URL encoding

### "IP not whitelisted"

- Add `0.0.0.0/0` to Network Access in MongoDB Atlas

## Example Connection String

```
mongodb+srv://gautamtinker83:MyPassword123@cluster0.p9ukimr.mongodb.net/astha-love-website?retryWrites=true&w=majority
```

⚠️ **Never commit your .env file to GitHub!** It's already in .gitignore.
