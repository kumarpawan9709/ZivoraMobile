#!/bin/bash

echo "🚀 Building Zivora Android APK..."

# Step 1: Build the web app
echo "📦 Building web application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Web build failed"
    exit 1
fi

# Step 2: Copy to Android
echo "📱 Copying to Android platform..."
npx cap copy android
if [ $? -ne 0 ]; then
    echo "❌ Android copy failed"
    exit 1
fi

# Step 3: Create APK build directory
echo "📁 Setting up APK build..."
mkdir -p android-apk-build
cd android/app

# Step 4: Build APK using Gradle
echo "🔨 Building APK with Gradle..."
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "❌ APK build failed"
    exit 1
fi

# Step 5: Copy APK to download location
echo "📥 Copying APK for download..."
cd ../..
cp android/app/build/outputs/apk/debug/app-debug.apk dist/public/zivora-debug.apk
if [ $? -eq 0 ]; then
    echo "✅ APK ready for download: zivora-debug.apk"
    ls -lh dist/public/zivora-debug.apk
else
    echo "❌ Failed to copy APK"
    exit 1
fi

echo "🎉 Android APK build complete!"
echo "Download: https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev/zivora-debug.apk"