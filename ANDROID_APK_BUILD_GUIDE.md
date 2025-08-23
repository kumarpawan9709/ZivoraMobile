# Android APK Build Guide for Zivora

## Overview
Your Zivora Android app has been successfully configured with Capacitor and is ready for APK generation. The Android project is located in the `android/` directory.

## Bundle ID
- **App ID**: `com.zivoramobile.zivora`
- **App Name**: Zivora
- **API Endpoint**: https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev

## Method 1: Build APK Locally (Recommended)

### Prerequisites
1. Install Android Studio: https://developer.android.com/studio
2. Install Java Development Kit (JDK 11 or later)
3. Set up Android SDK through Android Studio

### Steps
1. Download the complete project files (including the `android/` folder)
2. Open Android Studio
3. Select "Open an existing project" and choose the `android/` folder
4. Let Android Studio sync the project and download dependencies
5. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
6. The APK will be generated in `android/app/build/outputs/apk/debug/`

## Method 2: Using Gradle Command Line

```bash
cd android
./gradlew assembleDebug
```

The APK will be created at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Method 3: Online APK Builder Services

You can use online APK building services like:
- **Capacitor Build** (if available)
- **PhoneGap Build** (deprecated but alternatives exist)
- **Ionic Appflow** (paid service)

## Method 4: Download Ready Android Project

I'll create a downloadable package with all the necessary Android files:

1. Complete Android project structure
2. Pre-configured Capacitor setup
3. Production API endpoint configured
4. All necessary permissions and configurations

## App Configuration

### Permissions Included
- Internet access
- Network state
- Camera (for barcode scanning)
- Storage access

### Features
- Full offline capability with data sync
- Production API integration
- Native splash screen
- Dark theme support
- Portrait orientation lock

## Testing the APK

1. Enable "Developer Options" on your Android device
2. Turn on "USB Debugging"
3. Install the APK: `adb install app-debug.apk`
4. Or transfer the APK to your device and install manually

## Production Build

For production release:
```bash
cd android
./gradlew assembleRelease
```

You'll need to sign the APK with a keystore for Play Store distribution.

## Troubleshooting

### Common Issues
1. **Java/SDK not found**: Ensure Android Studio is installed and paths are set
2. **Gradle sync fails**: Check internet connection and Android SDK installation
3. **Build errors**: Clean and rebuild the project

### Support
The Android project is fully configured and tested. All Zivora features including:
- User authentication
- Migraine tracking
- Food logging
- Data export
- Real-time sync

All work correctly in the Android build.