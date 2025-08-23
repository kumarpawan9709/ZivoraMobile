# Zivora Android Build Guide

## 🚀 Building Zivora Android APK

This package contains the complete Android source code for the Zivora migraine tracking app.

### 📋 Requirements
- **Android Studio** (Recommended) OR Android SDK Command Line Tools
- **Java 11+** (OpenJDK or Oracle JDK)
- **Gradle** (included in project)
- **Android SDK API 24+** (Android 7.0+)

### 🏗️ Build Methods

#### Method 1: Android Studio (Easiest)
1. **Install Android Studio** from https://developer.android.com/studio
2. **Extract this package** to your desired location
3. **Open Android Studio**
4. **Open Project** → Select the `android` folder
5. **Wait for sync** - Android Studio will download dependencies
6. **Build APK**: 
   - Menu: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Or use: `Ctrl+Shift+A` → Type "Build APK"
7. **Find APK**: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Method 2: Command Line
```bash
# Navigate to android directory
cd android

# Make gradlew executable (Linux/Mac)
chmod +x gradlew

# Build debug APK
./gradlew assembleDebug

# For Windows
gradlew.bat assembleDebug

# APK location
ls -la app/build/outputs/apk/debug/app-debug.apk
```

#### Method 3: Release APK (Signed)
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore zivora-release-key.keystore -alias zivora -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
./gradlew assembleRelease

# APK location
ls -la app/build/outputs/apk/release/app-release-unsigned.apk
```

### 📱 Installation
1. **Enable Unknown Sources** on your Android device:
   - Settings → Security → Install unknown apps → Enable for your file manager
2. **Transfer APK** to your device
3. **Install** by tapping the APK file

### 🔧 Troubleshooting

#### Common Issues:
- **SDK not found**: Install Android SDK through Android Studio
- **Java version**: Ensure Java 11+ is installed and set as JAVA_HOME
- **Gradle sync failed**: Check internet connection and retry
- **Build failed**: Clean project with `./gradlew clean` then rebuild

#### Error Solutions:
```bash
# Clean build
./gradlew clean
./gradlew assembleDebug

# Check Java version
java -version

# Verify Android SDK
echo $ANDROID_HOME
```

### 📦 App Details
- **Package Name**: com.zivoramobile.zivora
- **Version**: 1.0.0
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Permissions**: Internet, Camera (optional), Storage

### 🎯 Features Included
- ✅ Migraine tracking and logging
- ✅ Symptom and trigger management  
- ✅ Smart health insights
- ✅ Risk assessment scoring
- ✅ Food and medication tracking
- ✅ Data export capabilities
- ✅ Secure user authentication
- ✅ Responsive mobile design

### 📞 Support
If you encounter issues building the APK, the most common solution is using Android Studio's built-in build system rather than command line tools.

Built with ❤️ using React + Capacitor