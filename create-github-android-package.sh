#!/bin/bash

echo "🚀 Creating GitHub Android Package with Auto-Build System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Build web assets
echo -e "${BLUE}Building web application...${NC}"
npm run build

# Create GitHub package directory
GITHUB_DIR="zivora-android-github"
rm -rf $GITHUB_DIR
mkdir -p $GITHUB_DIR

# Copy entire project structure
echo -e "${YELLOW}Copying project files...${NC}"
cp -r client/ $GITHUB_DIR/
cp -r server/ $GITHUB_DIR/
cp -r shared/ $GITHUB_DIR/
cp -r dist/ $GITHUB_DIR/
cp package.json $GITHUB_DIR/
cp *.ts $GITHUB_DIR/ 2>/dev/null || true
cp *.json $GITHUB_DIR/ 2>/dev/null || true

# Create Android project structure
mkdir -p $GITHUB_DIR/android/app/src/main/{java/com/zivoramobile/zivora,res/{values,drawable,mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}},assets}

# Create proper build.gradle for app
cat > $GITHUB_DIR/android/app/build.gradle << 'EOF'
apply plugin: 'com.android.application'

android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"
    
    defaultConfig {
        applicationId "com.zivoramobile.zivora"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.debug
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    packagingOptions {
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/NOTICE.txt'
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
EOF

# Create root build.gradle
cat > $GITHUB_DIR/android/build.gradle << 'EOF'
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
EOF

# Create gradle.properties
cat > $GITHUB_DIR/android/gradle.properties << 'EOF'
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
EOF

# Create settings.gradle
cat > $GITHUB_DIR/android/settings.gradle << 'EOF'
include ':app'
rootProject.name = "Zivora"
EOF

# Create proper AndroidManifest.xml
cat > $GITHUB_DIR/android/app/src/main/AndroidManifest.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.zivoramobile.zivora">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTop"
            android:windowSoftInputMode="adjustResize">
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# Create MainActivity.java
cat > $GITHUB_DIR/android/app/src/main/java/com/zivoramobile/zivora/MainActivity.java << 'EOF'
package com.zivoramobile.zivora;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class MainActivity extends Activity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/www/index.html");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

# Copy web assets to Android assets
echo -e "${YELLOW}Copying web assets to Android assets...${NC}"
cp -r dist/public/* $GITHUB_DIR/android/app/src/main/assets/www/

# Create strings.xml
cat > $GITHUB_DIR/android/app/src/main/res/values/strings.xml << 'EOF'
<resources>
    <string name="app_name">Zivora</string>
</resources>
EOF

# Create backup_rules.xml
mkdir -p $GITHUB_DIR/android/app/src/main/res/xml
cat > $GITHUB_DIR/android/app/src/main/res/xml/backup_rules.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="." />
</full-backup-content>
EOF

# Create data_extraction_rules.xml
cat > $GITHUB_DIR/android/app/src/main/res/xml/data_extraction_rules.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <exclude domain="sharedpref" path="." />
    </cloud-backup>
    <device-transfer>
        <exclude domain="sharedpref" path="." />
    </device-transfer>
</data-extraction-rules>
EOF

# Create app icons for all densities
echo -e "${YELLOW}Creating app icons...${NC}"
for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
    case $density in
        mdpi) size=48;;
        hdpi) size=72;;
        xhdpi) size=96;;
        xxhdpi) size=144;;
        xxxhdpi) size=192;;
    esac
    
    python3 << PYTHON_SCRIPT
import struct
import zlib

size = $size
density = "$density"

# Create app icon
with open(f'$GITHUB_DIR/android/app/src/main/res/mipmap-{density}/ic_launcher.png', 'wb') as f:
    # PNG signature
    f.write(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    f.write(struct.pack('>I', 13))
    f.write(b'IHDR')
    f.write(struct.pack('>II', size, size))
    f.write(b'\x08\x06\x00\x00\x00')  # RGBA
    
    # CRC for IHDR
    ihdr_data = b'IHDR' + struct.pack('>II', size, size) + b'\x08\x06\x00\x00\x00'
    f.write(struct.pack('>I', zlib.crc32(ihdr_data) & 0xffffffff))
    
    # Create purple Zivora icon
    purple = b'\x99\x33\xCC\xFF'  # Purple with alpha
    row = b'\x00' + purple * size  # filter + pixels
    image_data = row * size
    compressed = zlib.compress(image_data)
    
    # IDAT chunk
    f.write(struct.pack('>I', len(compressed)))
    f.write(b'IDAT')
    f.write(compressed)
    f.write(struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff))
    
    # IEND chunk
    f.write(struct.pack('>I', 0))
    f.write(b'IEND')
    f.write(struct.pack('>I', 0xAE426082))

# Create round icon (same as regular)
with open(f'$GITHUB_DIR/android/app/src/main/res/mipmap-{density}/ic_launcher_round.png', 'wb') as f:
    # PNG signature
    f.write(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    f.write(struct.pack('>I', 13))
    f.write(b'IHDR')
    f.write(struct.pack('>II', size, size))
    f.write(b'\x08\x06\x00\x00\x00')
    
    # CRC for IHDR
    ihdr_data = b'IHDR' + struct.pack('>II', size, size) + b'\x08\x06\x00\x00\x00'
    f.write(struct.pack('>I', zlib.crc32(ihdr_data) & 0xffffffff))
    
    # Create round purple icon
    center = size // 2
    pixels = []
    for y in range(size):
        row_pixels = [b'\x00']  # filter
        for x in range(size):
            dist = ((x - center) ** 2 + (y - center) ** 2) ** 0.5
            if dist <= center:
                row_pixels.append(b'\x99\x33\xCC\xFF')  # Purple
            else:
                row_pixels.append(b'\x00\x00\x00\x00')  # Transparent
        pixels.append(b''.join(row_pixels))
    
    image_data = b''.join(pixels)
    compressed = zlib.compress(image_data)
    
    # IDAT chunk
    f.write(struct.pack('>I', len(compressed)))
    f.write(b'IDAT')
    f.write(compressed)
    f.write(struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff))
    
    # IEND chunk
    f.write(struct.pack('>I', 0))
    f.write(b'IEND')
    f.write(struct.pack('>I', 0xAE426082))

print(f"Icons created for {density}")
PYTHON_SCRIPT
done

# Create GitHub Actions workflow
mkdir -p $GITHUB_DIR/.github/workflows
cat > $GITHUB_DIR/.github/workflows/build-android.yml << 'EOF'
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v3
      
    - name: Cache Gradle packages
      uses: actions/cache@v3
      with:
        path: |
          ~/.gradle/caches
          ~/.gradle/wrapper
        key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
        restore-keys: |
          ${{ runner.os }}-gradle-
          
    - name: Grant execute permission for gradlew
      run: chmod +x android/gradlew
      
    - name: Build Debug APK
      working-directory: android
      run: ./gradlew assembleDebug
      
    - name: Build Release APK
      working-directory: android
      run: ./gradlew assembleRelease
      
    - name: Upload Debug APK
      uses: actions/upload-artifact@v3
      with:
        name: zivora-debug-apk
        path: android/app/build/outputs/apk/debug/*.apk
        
    - name: Upload Release APK
      uses: actions/upload-artifact@v3
      with:
        name: zivora-release-apk
        path: android/app/build/outputs/apk/release/*.apk
EOF

# Create Gradle Wrapper
mkdir -p $GITHUB_DIR/android/gradle/wrapper
cat > $GITHUB_DIR/android/gradle/wrapper/gradle-wrapper.properties << 'EOF'
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.4-bin.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
EOF

# Create gradlew script
cat > $GITHUB_DIR/android/gradlew << 'EOF'
#!/bin/sh

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

# Resolve links: $0 may be a link
PRG="$0"
while [ -h "$PRG" ] ; do
    ls=`ls -ld "$PRG"`
    link=`expr "$ls" : '.*-> \(.*\)$'`
    if expr "$link" : '/.*' > /dev/null; then
        PRG="$link"
    else
        PRG=`dirname "$PRG"`"/$link"
    fi
done

SAVED="`pwd`"
cd "`dirname \"$PRG\"`/" >/dev/null
APP_HOME="`pwd -P`"
cd "$SAVED" >/dev/null

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

exec java $DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS \"-Dorg.gradle.appname=$APP_BASE_NAME\" -classpath \"$CLASSPATH\" org.gradle.wrapper.GradleWrapperMain "$@"
EOF

chmod +x $GITHUB_DIR/android/gradlew

# Create README with instructions
cat > $GITHUB_DIR/README.md << 'EOF'
# Zivora Android Build

This repository contains the complete Android project for Zivora mobile app.

## Automatic APK Building

The GitHub Actions workflow automatically builds APKs when you push to this repository:

1. **Debug APK**: Built with debug signing for testing
2. **Release APK**: Built with release configuration, ready for distribution

## Download APKs

After pushing to GitHub, go to the **Actions** tab to download the built APKs:

1. Click on the latest workflow run
2. Scroll to **Artifacts** section
3. Download either:
   - `zivora-debug-apk` (for testing)
   - `zivora-release-apk` (for distribution)

## Local Building

To build locally:

```bash
cd android
./gradlew assembleDebug    # For debug APK
./gradlew assembleRelease  # For release APK
```

APKs will be generated in `android/app/build/outputs/apk/`

## Installation

1. Download the APK from GitHub Actions artifacts
2. Enable "Install unknown apps" on your Android device
3. Install the APK file

The APKs built by this system should install correctly without parsing errors.
EOF

# Package the GitHub project
echo -e "${BLUE}Creating GitHub package...${NC}"
cd $GITHUB_DIR
zip -r ../dist/public/zivora-android-github.zip . -x "*.git*" "node_modules/*" "dist/*"
cd ..

# Clean up
rm -rf $GITHUB_DIR

echo ""
echo -e "${GREEN}✅ GitHub Android package created successfully!${NC}"
echo ""
ls -lh dist/public/zivora-android-github.zip

# Get domain
DOMAIN=$(echo $REPLIT_DEV_DOMAIN || echo "localhost:5000")
if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "localhost:5000" ]; then
    DOMAIN="3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev"
fi

echo ""
echo -e "${YELLOW}📥 Download GitHub Package:${NC}"
echo "https://$DOMAIN/zivora-android-github.zip"
echo ""
echo -e "${GREEN}🔧 Setup Instructions:${NC}"
echo "1. Download and extract the GitHub package"
echo "2. Create a new GitHub repository"
echo "3. Upload all files to your repository"  
echo "4. Push to main/master branch"
echo "5. Go to Actions tab and download built APKs"
echo ""
echo -e "${BLUE}The GitHub Actions will automatically build signed APKs that should install correctly${NC}"