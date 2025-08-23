# Zivora - Migraine Tracking Mobile App

A comprehensive migraine tracking and health management mobile application built with React, Node.js, and Capacitor for iOS deployment.

## Features

### Core Functionality
- **Migraine Tracking** - Log episodes with symptoms, triggers, and severity
- **Food Logging** - Nutrition database with barcode scanning and favorites
- **Daily Health Metrics** - Sleep, stress, hydration, and activity tracking
- **Risk Assessment** - AI-powered risk scoring and pattern analysis
- **Data Export** - CSV and PDF export for healthcare consultations
- **User Profiles** - Complete profile management and preferences

### Authentication
- **Email/Password Only** - App Store compliant authentication
- **Secure JWT** - Server-side session management
- **No External OAuth** - Removed Google/Apple login for compliance

### Mobile Features
- **iOS Ready** - Complete Capacitor iOS project included
- **Custom App Icon** - Professional Zivora branding
- **Native Features** - Haptics, keyboard handling, status bar
- **Offline Support** - Local data persistence

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS with shadcn/ui components
- React Router for navigation
- TanStack Query for state management
- Chart.js and Recharts for data visualization

### Backend
- Node.js with Express.js
- PostgreSQL with Drizzle ORM
- JWT authentication with bcrypt
- RESTful API design

### Mobile
- Capacitor for iOS integration
- Bundle ID: com.zivora.migrainertracker
- iOS 14.0+ target
- App Store submission ready

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file with:
```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
```

### 3. Database Setup
```bash
npm run db:push
```

### 4. Start Development
```bash
npm run dev
```

### 5. iOS Development
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared schemas and types
├── ios/             # iOS Capacitor project
├── capacitor.config.json
└── package.json
```

## App Store Information

- **App Name:** Zivora
- **Bundle ID:** com.zivora.migrainertracker
- **Category:** Medical
- **iOS Version:** 14.0+
- **Compliance:** Full App Store guidelines compliance

## Latest Changes

- Custom app icon implementation
- Removed external OAuth authentication
- App Store compliance modifications
- Complete iOS project structure
- Professional support page infrastructure
- Enhanced UI/UX with mobile-first design

## License

Proprietary - All rights reserved