# Zivora Android Source Code Package

## Overview
Complete Android source code for the Zivora migraine tracking application. This package contains all necessary files to build and compile Android APK files.

## Package Contents
- **android/**: Native Android project files with Capacitor configuration
- **client/**: React frontend source code (TypeScript + Tailwind CSS)
- **server/**: Node.js backend API (Express + TypeScript)
- **shared/**: Shared TypeScript schemas and types
- **capacitor.config.ts**: Capacitor mobile app configuration
- **package.json**: Node.js dependencies and build scripts

## Build Requirements
- Node.js 18+ with npm
- Android Studio or Android SDK
- Java Development Kit (JDK) 11+

## Quick Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync with Android
```bash
npx cap sync android
```

### 4. Open in Android Studio
```bash
npx cap open android
```

### 5. Build APK
In Android Studio:
- Build → Generate Signed Bundle/APK
- Select APK → Next
- Choose signing configuration
- Build release APK

## Alternative Command Line Build
```bash
cd android
./gradlew assembleRelease
```

## App Configuration
- **Bundle ID**: com.zivoramobile.zivora
- **App Name**: Zivora
- **Min SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 14 (API 34)

## Features Included
- ✅ Migraine episode tracking
- ✅ Daily health logging
- ✅ Food and nutrition tracking
- ✅ Symptom pattern analysis
- ✅ Risk assessment scoring
- ✅ Data export (CSV/PDF)
- ✅ User authentication
- ✅ Educational content

## Support
For build issues or questions, refer to the Capacitor Android documentation:
https://capacitorjs.com/docs/android

## Version Info
- Generated: August 19, 2025
- Zivora Version: 1.0.0
- Capacitor Version: Latest
- Android Target: API 34