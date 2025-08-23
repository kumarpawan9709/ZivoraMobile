# Zivora iOS - Pod Install Guide

## Quick Setup (Pod Install Only):

1. **Extract ZIP file**
2. **Navigate to project:**
   ```bash
   cd ios/App
   ```
3. **Run pod install:**
   ```bash
   pod install
   ```
4. **Open workspace:**
   ```bash
   open App.xcworkspace
   ```
5. **Build on device:**
   - Connect iPhone/iPad
   - Select device in Xcode
   - Press play button

## What's Included:
- Complete iOS Xcode project
- Podfile ready for installation
- Web assets pre-built
- Loading screen with Zivora logo
- Native launch screen configured

## Features:
- Custom loading screen (no black screen)
- Performance optimized
- Bundle ID: com.zivoramobile.zivora
- Ready for App Store

## If pod install fails:
```bash
pod repo update
pod install
```

Ready to run on your device!