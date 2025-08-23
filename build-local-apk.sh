#!/bin/bash

echo "🚀 Building Android APK locally..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if required tools are available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Node.js/npm not found${NC}"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found (required for Android build)${NC}"
    echo "This script requires Java 17+ and Android SDK"
    echo "Use GitHub Actions instead: github.com/your-repo → Actions → Build Android APK"
    exit 1
fi

# Build web assets
echo -e "${BLUE}1. Building web assets...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Web build failed${NC}"
    exit 1
fi

# Sync Capacitor
echo -e "${BLUE}2. Syncing Capacitor...${NC}"
npx cap sync android
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Capacitor sync failed${NC}"
    exit 1
fi

# Build Android APK
echo -e "${BLUE}3. Building Android APK...${NC}"
cd android
if [ ! -f "./gradlew" ]; then
    echo -e "${RED}❌ Gradle wrapper not found${NC}"
    exit 1
fi

./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Android build failed${NC}"
    echo -e "${YELLOW}💡 Try using GitHub Actions for automated builds${NC}"
    exit 1
fi

# Move APK to public directory
echo -e "${BLUE}4. Moving APK to public directory...${NC}"
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    cp "$APK_PATH" "../dist/public/app-latest.apk"
    APK_SIZE=$(wc -c < "../dist/public/app-latest.apk")
    echo -e "${GREEN}✅ APK built successfully!${NC}"
    echo -e "${GREEN}📱 APK size: $((APK_SIZE / 1024 / 1024)) MB${NC}"
    echo -e "${GREEN}📁 Location: dist/public/app-latest.apk${NC}"
    echo ""
    echo -e "${YELLOW}🔗 Download URL:${NC}"
    echo "https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev/download/apk"
else
    echo -e "${RED}❌ APK file not found after build${NC}"
    exit 1
fi

cd ..
echo -e "${GREEN}🎉 Local APK build complete!${NC}"