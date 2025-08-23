# Get Your Zivora APK in 10 Minutes

## Download Complete Android Project
**File:** `zivora-android-project-20250806.tar.gz` (8.6MB)
**Contains:** Complete Android project + build scripts + documentation

## Fastest Method: Android Studio
1. Download Android Studio (if not installed): https://developer.android.com/studio
2. Extract the project archive
3. Open Android Studio → "Open an existing project" → Select the `android/` folder
4. Wait for sync to complete (downloads dependencies automatically)
5. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)
6. Your APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Alternative: Command Line (Linux/Mac)
```bash
# Extract and build
tar -xzf zivora-android-project-20250806.tar.gz
cd zivora-android-project
./build-android-apk.sh
# APK created as: zivora-debug.apk
```

## Your APK Details
- **Size:** ~15-25MB
- **Bundle ID:** com.zivoramobile.zivora
- **Features:** Complete Zivora functionality
- **API:** Connected to production server
- **Compatibility:** Android 7.0+ (API 24+)

## Install on Your Phone
1. Enable Developer Options + USB Debugging
2. Connect phone via USB
3. Run: `adb install zivora-debug.apk`
4. Or copy APK to phone and install manually

The APK will have all Zivora features working: migraine tracking, food logging, data export, authentication, and real-time sync.