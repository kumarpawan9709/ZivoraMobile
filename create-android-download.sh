#!/bin/bash

# Create downloadable Android project package for Zivora

echo "📦 Creating Zivora Android Project Package..."

# Create temporary directory for the package
PACKAGE_DIR="zivora-android-project"
rm -rf $PACKAGE_DIR
mkdir -p $PACKAGE_DIR

# Copy essential files
echo "📁 Copying project files..."
cp -r android/ $PACKAGE_DIR/
cp capacitor.config.json $PACKAGE_DIR/
cp package.json $PACKAGE_DIR/
cp -r dist/ $PACKAGE_DIR/
cp build-android-apk.sh $PACKAGE_DIR/
cp ANDROID_APK_BUILD_GUIDE.md $PACKAGE_DIR/

# Create README for the package
cat > $PACKAGE_DIR/README.md << EOF
# Zivora Android Project

This package contains the complete Android project for the Zivora migraine tracking app.

## Quick Start

1. Install Android Studio: https://developer.android.com/studio
2. Open the \`android/\` folder in Android Studio
3. Let it sync and download dependencies
4. Build → Build APK(s)

## Alternative: Command Line

1. Ensure Java and Android SDK are installed
2. Run: \`./build-android-apk.sh\`

## App Details

- **Bundle ID**: com.zivoramobile.zivora
- **App Name**: Zivora
- **API Endpoint**: https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev

## Features

- Complete migraine tracking functionality
- Food logging with barcode scanning
- Data export (CSV/PDF)
- User authentication
- Real-time data sync
- Dark theme support

The APK will be approximately 15-25MB in size and works on Android 7.0+ (API level 24+).

For detailed instructions, see ANDROID_APK_BUILD_GUIDE.md
EOF

# Create the archive
echo "🗜️ Creating archive..."
tar -czf zivora-android-project-$(date +%Y%m%d).tar.gz $PACKAGE_DIR

# Clean up
rm -rf $PACKAGE_DIR

echo "✅ Package created: zivora-android-project-$(date +%Y%m%d).tar.gz"
echo "📱 This package contains everything needed to build the Zivora Android APK"