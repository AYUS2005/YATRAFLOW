# 🚀 YATRAFLOW Deployment Guide

## Firebase Hosting Deployment

### Prerequisites
- Firebase CLI installed globally
- Firebase project created
- Local environment fully tested

### Step-by-Step Deployment

#### 1. Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

#### 2. Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

#### 3. Initialize Firebase in Your Project

```bash
firebase init
```

**Configuration:**
- Select: **Hosting: Configure files for Firebase Hosting**
- Use an existing project: Select your YATRAFLOW project
- Public directory: `dist`
- Configure as single-page app: **Yes**
- Set up automatic builds with GitHub: **No** (optional)
- Don't overwrite `dist/index.html` if asked

This creates:
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project aliases

#### 4. Build Your Project

```bash
npm run build
```

This creates a production-optimized build in the `dist` folder.

#### 5. Test Locally (Optional)

```bash
firebase serve
```

Visit `http://localhost:5000` to test the build locally.

#### 6. Deploy to Firebase

```bash
firebase deploy
```

Or deploy only hosting:
```bash
firebase deploy --only hosting
```

Your site will be live at:
- `https://YOUR_PROJECT_ID.web.app`
- `https://YOUR_PROJECT_ID.firebaseapp.com`

## Custom Domain Setup

### 1. Add Custom Domain in Firebase Console

1. Go to Firebase Console > Hosting
2. Click **Add custom domain**
3. Enter your domain (e.g., `yatraflow.com`)
4. Verify ownership:
   - Add TXT record to your domain's DNS
   - Wait for verification (can take up to 24 hours)

### 2. Configure DNS Records

Add these records in your domain registrar:

**For root domain (yatraflow.com):**
```
Type: A
Name: @
Value: [IP addresses from Firebase]
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: YOUR_PROJECT_ID.web.app
```

### 3. SSL Certificate

Firebase automatically provisions SSL certificates. Wait 24-48 hours for full activation.

## Environment Variables for Production

### Update Firebase Configuration

Make sure your production Firebase config is correct in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_PRODUCTION_API_KEY",
  authDomain: "YOUR_PRODUCTION_AUTH_DOMAIN",
  projectId: "YOUR_PRODUCTION_PROJECT_ID",
  storageBucket: "YOUR_PRODUCTION_STORAGE_BUCKET",
  messagingSenderId: "YOUR_PRODUCTION_MESSAGING_SENDER_ID",
  appId: "YOUR_PRODUCTION_APP_ID"
};
```

### Update MapTiler API Key

Update production MapTiler key in `src/components/dashboard/MapView.tsx`:

```typescript
const MAPTILER_API_KEY = 'YOUR_PRODUCTION_MAPTILER_KEY';
```

## Firebase Hosting Configuration

### firebase.json Example

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Continuous Deployment with GitHub Actions

### Create .github/workflows/deploy.yml

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: YOUR_PROJECT_ID
```

### Setup GitHub Secrets

1. Generate Firebase service account:
```bash
firebase login:ci
```

2. Add to GitHub repository secrets:
   - `FIREBASE_SERVICE_ACCOUNT`: Service account JSON

## Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Site loads at production URL
- [ ] All routes work correctly
- [ ] Authentication works
- [ ] Map loads with correct tiles
- [ ] Location permissions work
- [ ] Alerts trigger correctly
- [ ] Firebase connections work
- [ ] No console errors

### ✅ Performance Optimization

- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Lazy load components
- [ ] Implement code splitting
- [ ] Add service worker for PWA

### ✅ Security

- [ ] Update Firestore security rules
- [ ] Enable App Check (optional)
- [ ] Review Firebase quotas
- [ ] Set up monitoring alerts

### ✅ SEO & Analytics

- [ ] Submit sitemap to Google
- [ ] Add Google Analytics
- [ ] Configure Firebase Analytics
- [ ] Set up Performance Monitoring

## Monitoring & Maintenance

### Firebase Console Monitoring

1. **Hosting metrics**: View traffic, bandwidth usage
2. **Authentication**: Monitor sign-ins, errors
3. **Firestore**: Check document reads/writes
4. **Performance**: Monitor app speed, errors

### Set Up Budget Alerts

1. Go to Firebase Console > Usage and billing
2. Set up budget alerts
3. Monitor quotas regularly

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Rebuild and redeploy
npm run build
firebase deploy
```

## Rollback Strategy

### Rollback to Previous Version

```bash
firebase hosting:rollback
```

Firebase keeps previous versions available for quick rollback.

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deploy Fails

```bash
# Re-authenticate
firebase login --reauth

# Check Firebase status
firebase projects:list
```

### SSL Certificate Issues

- Wait 24-48 hours for auto-provisioning
- Check domain verification in Firebase Console
- Verify DNS records are correct

### Performance Issues

- Enable CDN in Firebase Console
- Optimize bundle size: `npm run build -- --stats`
- Use lazy loading for heavy components
- Implement code splitting

## Cost Optimization

### Free Tier Limits
- 10 GB storage
- 360 MB/day bandwidth
- 125K/month reads (Firestore)
- 50K/month writes (Firestore)

### Reduce Costs
1. Implement caching strategies
2. Optimize Firestore queries
3. Use CDN for static assets
4. Monitor and set quotas

## Production Best Practices

1. **Environment separation**: Use separate Firebase projects for dev/staging/production
2. **Backup Firestore**: Export data regularly
3. **Monitor logs**: Enable Cloud Logging
4. **Test before deploy**: Always test builds locally
5. **Version control**: Tag releases in git
6. **Documentation**: Keep deployment docs updated

## Support & Resources

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [MapTiler Documentation](https://docs.maptiler.com/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

**Your YATRAFLOW app is now production-ready! 🎉**
