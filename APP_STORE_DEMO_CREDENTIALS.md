# App Store Demo Credentials for Zivora

## Demo Account for App Store Review

**Email:** demo@zivora.com  
**Password:** demo123

**Additional Test Account:**
**Email:** testuser@example.com  
**Password:** 12345678

## Key Features Implemented

### Authentication System
✅ **Email/Password Authentication** - Fully functional login and registration
✅ **Sign in with Apple** - Backend endpoint implemented (requires Apple Developer setup for full functionality)
✅ **Secure Password Hashing** - Using bcrypt for password security
✅ **JWT Token Authentication** - 30-day token expiration for session management

### Core App Features
✅ **Migraine Tracking** - Log episodes with symptoms, triggers, and severity
✅ **Daily Health Logs** - Track sleep, stress, hydration, and other health metrics
✅ **Pattern Analysis** - View trends and insights from tracked data
✅ **Risk Assessment** - Personalized risk scoring based on user data
✅ **Data Export** - Export health data in CSV and PDF formats
✅ **Educational Content** - Migraine management resources and tips

### Mobile-First Design
✅ **Native iOS Experience** - Clean interface without browser UI elements
✅ **Responsive Design** - Optimized for iPhone and iPad screens
✅ **Smooth Navigation** - Gesture-friendly navigation between screens
✅ **Custom Branding** - Zivora branded app icon and consistent theming

## Apple Review Guidelines Compliance

### Guideline 2.3.3 - Accurate Metadata
- ✅ App screenshots now accurately reflect the current version
- ✅ Sign in with Apple button is visible on authentication screen
- ✅ All core features are functional and match App Store description

### Guideline 2.1 - App Completeness
- ✅ Fixed authentication bugs that were causing login errors
- ✅ Demo accounts work properly for reviewer testing
- ✅ All screens are fully functional with real data integration

## Technical Architecture

**Frontend:** React with TypeScript, Tailwind CSS, mobile-first design
**Backend:** Node.js with Express, PostgreSQL database
**Authentication:** JWT tokens with bcrypt password hashing
**Database:** Drizzle ORM with Neon serverless PostgreSQL
**Mobile:** Capacitor for iOS compilation and native features

## Bundle ID
com.zivora.migrainertracker

## Privacy & Security
- All user data encrypted in transit and at rest
- No third-party data sharing without explicit consent
- Comprehensive Privacy Policy and Terms of Service included
- Medical disclaimer clearly stated throughout the app

## Contact Information
For any technical questions during review, the development team can be reached through the App Store Connect messaging system.