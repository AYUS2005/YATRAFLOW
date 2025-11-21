# YATRAFLOW - Complete Setup Guide

## 🚀 Quick Start

YATRAFLOW is a real-time accident zone alert system built with React, TypeScript, Firebase, and MapLibre.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- MapTiler account (for map tiles)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd yatraflow
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "YATRAFLOW"
4. Follow the setup wizard

#### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** provider
3. Add your authorized domains

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your region

#### Set Up Firestore Collections

Run these in Firestore Console or use the Firebase Admin SDK:

**Collection: users**
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  role: 'user' | 'admin',
  createdAt: timestamp
}
```

**Collection: accident_zones**
```javascript
{
  name: string,
  lat: number,
  lng: number,
  severity: 'low' | 'medium' | 'high' | 'critical',
  radius: number, // in meters
  description: string,
  timestamp: timestamp,
  createdBy: string (user uid)
}
```

**Collection: hazards**
```javascript
{
  type: 'pothole' | 'debris' | 'construction' | 'accident' | 'other',
  lat: number,
  lng: number,
  description: string,
  reportedBy: string (user uid),
  reportedByName: string,
  status: 'pending' | 'approved' | 'rejected',
  timestamp: timestamp,
  approvedBy: string (optional),
  approvedAt: timestamp (optional)
}
```

#### Configure Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Accident zones - read by all, write by admins only
    match /accident_zones/{zoneId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Hazards
    match /hazards/{hazardId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (</>)
4. Copy the configuration object

### 3. Configure Environment

Update `src/lib/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. MapTiler Setup

#### Get MapTiler API Key
1. Go to [MapTiler](https://www.maptiler.com/)
2. Sign up / Sign in
3. Go to **Account** > **Keys**
4. Copy your API key

#### Configure MapTiler

Update `src/components/dashboard/MapView.tsx`:

```typescript
const MAPTILER_API_KEY = 'YOUR_MAPTILER_API_KEY';
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:8080`

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── landing/         # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   └── Footer.tsx
│   └── dashboard/       # Dashboard components
│       ├── MapView.tsx
│       ├── AlertPanel.tsx
│       └── ReportHazardForm.tsx
├── hooks/               # Custom React hooks
│   ├── useGeolocation.ts
│   ├── useAccidentZones.ts
│   ├── useHazards.ts
│   └── useAlerts.ts
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   └── utils.ts
├── pages/               # Route pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── Admin.tsx
├── store/
│   └── useStore.ts      # Zustand state management
├── types/
│   └── index.ts         # TypeScript types
└── App.tsx              # Main app component
```

## 🎯 Features

### Implemented
- ✅ Beautiful landing page with animations
- ✅ Firebase Google authentication
- ✅ Real-time GPS location tracking
- ✅ MapLibre map with MapTiler tiles
- ✅ Accident zone markers with severity colors
- ✅ Road hazard markers
- ✅ Proximity-based alert system
- ✅ Sound, toast, and vibration alerts
- ✅ Hazard reporting form
- ✅ Admin panel for hazard approval
- ✅ Real-time Firestore sync
- ✅ Responsive design

## 🔐 Setting Up Admin User

To make a user an admin:

1. Sign in to the app with Google
2. Go to Firebase Console > Firestore Database
3. Find the user in the `users` collection
4. Edit the document and change `role` from `"user"` to `"admin"`
5. Refresh the app

## 🚀 Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
- Select **Hosting**
- Choose your Firebase project
- Set public directory to `dist`
- Configure as single-page app: **Yes**
- Don't overwrite index.html

4. Build the project:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy
```

Your app will be live at `https://your-project.web.app`

## 📱 Testing the App

### Test Scenario 1: User Flow
1. Visit the landing page
2. Click "Get Started"
3. Sign in with Google
4. Allow location access
5. View the map with your location
6. Click "Report Hazard"
7. Submit a hazard report
8. Check the alert panel

### Test Scenario 2: Admin Flow
1. Make your user an admin (see above)
2. Sign in
3. Click "Admin Panel" in the dashboard
4. Go to "Pending Hazards" tab
5. Approve or reject user reports
6. Approved hazards appear on the map

### Test Scenario 3: Alert System
1. Add test accident zones in Firestore:
```javascript
{
  name: "Test Zone",
  lat: YOUR_CURRENT_LAT,
  lng: YOUR_CURRENT_LNG,
  severity: "high",
  radius: 500,
  description: "Test accident zone",
  timestamp: new Date(),
  createdBy: "admin"
}
```
2. Move close to the zone (or simulate location)
3. You should receive alerts (toast, sound, vibration)

## 🐛 Troubleshooting

### Map Not Loading
- Check MapTiler API key is correct
- Check browser console for errors
- Verify network requests to MapTiler API

### Location Not Working
- Ensure HTTPS (required for geolocation)
- Check browser permissions
- Use Chrome/Firefox (best support)

### Firebase Errors
- Verify Firebase config is correct
- Check Firestore security rules
- Ensure collections are created
- Check Firebase Console for quota limits

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run clean` (if available)
- Update dependencies: `npm update`

## 📚 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Firebase** - Backend (Auth, Firestore)
- **MapLibre GL** - Map rendering
- **MapTiler** - Map tiles
- **Zustand** - State management
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Shadcn UI** - Component library
- **React Hot Toast** - Notifications

## 🤝 Contributing

This is a complete production-ready system. To extend:

1. **Add new alert types**: Update types in `src/types/index.ts`
2. **Customize map styles**: Change MapTiler style in `MapView.tsx`
3. **Add more admin features**: Extend `Admin.tsx`
4. **Improve alert logic**: Modify `useAlerts.ts`

## 📄 License

MIT License - feel free to use in your projects!

## 💡 Tips

- Use real GPS data for best experience
- Test on mobile devices for full alert experience
- Add more accident zones via Firestore Console
- Customize severity thresholds in alert logic
- Use Firebase Analytics for usage tracking

## 🎉 You're All Set!

Your YATRAFLOW system is now ready to keep users safe on the road!
