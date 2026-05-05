# Deployment Guide

## Step-by-Step Deployment to Vercel

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit - Precision Sky Solutions website with client portal"
```

### 3. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "precision-sky-solutions")
3. Don't initialize with README (we already have one)

### 4. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/precision-sky-solutions.git
git branch -M main
git push -u origin main
```

### 5. Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

6. Add Environment Variables:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_cH0SWsv1mgCo@ep-jolly-rice-abdc3yaq-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET`: `your-super-secret-jwt-key-change-this-in-production`
   - `NODE_ENV`: `production`

7. Click "Deploy"

### 6. Initialize Database

After deployment, the database tables will be created automatically on the first API call. You can manually initialize by:

1. Visit your deployed site
2. Go to `/client-login.html`
3. Register a new account
4. This will trigger the database initialization

### 7. Access Your Site

- **Main Website**: `https://your-site.vercel.app`
- **Client Login**: `https://your-site.vercel.app/client-login.html`
- **Client Dashboard**: `https://your-site.vercel.app/client-dashboard.html`

## Adding Media Files for Clients

Currently, media files need to be added via the API. You can:

1. **Option A**: Create an admin panel (future enhancement)
2. **Option B**: Use a tool like Postman to POST to `/api/media`
3. **Option C**: Upload files to a cloud storage (AWS S3, Cloudinary) and add URLs to database

### Example: Add Media via API

```bash
curl -X POST https://your-site.vercel.app/api/media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Aerial Shot - Downtown",
    "description": "4K aerial footage of downtown area",
    "fileType": "video/mp4",
    "fileUrl": "https://your-storage.com/video.mp4",
    "thumbnailUrl": "https://your-storage.com/thumb.jpg",
    "fileSize": 52428800,
    "projectName": "Downtown Project",
    "tags": ["aerial", "downtown", "4k"]
  }'
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct in Vercel environment variables
- Check Neon.tech dashboard for connection status

### API Not Working
- Check Vercel function logs
- Verify all environment variables are set
- Ensure `vercel.json` is in root directory

### Client Portal Not Loading
- Clear browser cache
- Check browser console for errors
- Verify token is being stored in localStorage

## Security Notes

⚠️ **IMPORTANT**: Change the JWT_SECRET to a strong, random value in production!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Next Steps

1. **Custom Domain**: Add your domain in Vercel settings
2. **SSL Certificate**: Automatically provided by Vercel
3. **File Upload**: Implement file upload functionality (requires cloud storage)
4. **Admin Panel**: Create admin interface to manage client media
5. **Email Notifications**: Add email notifications for new uploads
