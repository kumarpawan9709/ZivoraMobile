#!/bin/bash

echo "🚀 Creating Production APK for Google Play Store..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf android-production
mkdir -p android-production

# Step 2: Copy Android project
echo "📱 Setting up production Android project..."
cp -r android/* android-production/

# Step 3: Update build.gradle for production
echo "⚙️ Configuring production build..."

# Update app/build.gradle for release configuration
cat > android-production/app/build.gradle << 'EOF'
apply plugin: 'com.android.application'

android {
    namespace "com.zivoramobile.zivora"
    compileSdk 34

    defaultConfig {
        applicationId "com.zivoramobile.zivora"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
             // Files and dirs to omit from the packaged assets dir, modified to accommodate modern web apps.
             // Default: https://android.googlesource.com/platform/frameworks/base/+/282e181b58cf72b6ca770dc7ca5f91f135444502/tools/aapt/AaptAssets.cpp#61
            ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }

    signingConfigs {
        release {
            storeFile file('zivora-release-key.keystore')
            storePassword 'zivora123456'
            keyAlias 'zivora'
            keyPassword 'zivora123456'
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
        debug {
            signingConfig signingConfigs.debug
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

repositories {
    google()
    mavenCentral()
    flatDir{
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation project(':capacitor-cordova-android-plugins')
    implementation "androidx.coordinatorlayout:coordinatorlayout:1.2.0"
    implementation 'androidx.core:core-splashscreen:1.0.1'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    implementation project(':capacitor-android')
}

apply from: 'capacitor.build.gradle'

try {
    def servicesJSON = file('google-services.json')
    if (servicesJSON.text) {
        apply plugin: 'com.google.gms.google-services'
    }
} catch(Exception e) {
    logger.info "google-services.json not found, google-services plugin not applied. Push Notifications won't work"
}
EOF

# Step 4: Create production keystore
echo "🔑 Generating production keystore..."
cd android-production/app

# Generate keystore for signing
keytool -genkey -v -keystore zivora-release-key.keystore \
    -alias zivora \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass zivora123456 \
    -keypass zivora123456 \
    -dname "CN=Zivora, OU=Mobile, O=Zivora Inc, L=San Francisco, ST=CA, C=US"

cd ../..

# Step 5: Build production web assets
echo "📦 Building optimized web assets..."
npm run build

# Step 6: Copy to Android
echo "📱 Copying to Android platform..."
cp -r dist/public/* android-production/app/src/main/assets/

# Step 7: Build signed release APK
echo "🔨 Building signed release APK..."
cd android-production

# Make gradlew executable
chmod +x gradlew

# Clean and build release
./gradlew clean
./gradlew assembleRelease

# Step 8: Copy production APK
echo "📥 Copying production APK..."
cd ..

if [ -f "android-production/app/build/outputs/apk/release/app-release.apk" ]; then
    cp android-production/app/build/outputs/apk/release/app-release.apk dist/public/zivora-production.apk
    echo "✅ Production APK created successfully!"
    ls -lh dist/public/zivora-production.apk
    echo "📥 Download: https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev/zivora-production.apk"
else
    echo "❌ Failed to create production APK"
    echo "📂 Checking build outputs:"
    find android-production/app/build/outputs -name "*.apk" -ls
    exit 1
fi

echo "🎉 Production APK ready for Google Play Store upload!"
echo "📋 Keystore info saved for future updates:"
echo "   - Keystore: zivora-release-key.keystore"
echo "   - Alias: zivora"
echo "   - Password: zivora123456"