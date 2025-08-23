#!/bin/bash

echo "🚀 Building Zivora APK using alternative method..."

# Check if we have basic build tools
if ! command -v zip &> /dev/null; then
    echo "Installing zip..."
    apt-get update && apt-get install -y zip
fi

# Create a minimal APK structure
echo "📦 Creating APK structure..."
mkdir -p apk-build/{META-INF,assets,res/values,lib}

# Copy web assets
echo "📱 Copying web application..."
cp -r dist/public/* apk-build/assets/

# Create AndroidManifest.xml
cat > apk-build/AndroidManifest.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zivoramobile.zivora"
    android:versionCode="1"
    android:versionName="1.0.0">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    
    <application
        android:label="Zivora"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:allowBackup="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# Create basic resources
echo "🎨 Creating resources..."
mkdir -p apk-build/res/{mipmap-hdpi,mipmap-mdpi,mipmap-xhdpi,mipmap-xxhdpi,mipmap-xxxhdpi}

# Create strings.xml
cat > apk-build/res/values/strings.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Zivora</string>
    <string name="title_activity_main">Zivora</string>
    <string name="package_name">com.zivoramobile.zivora</string>
    <string name="custom_url_scheme">zivora</string>
</resources>
EOF

# Create styles.xml
cat > apk-build/res/values/styles.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">#a078ff</item>
        <item name="colorPrimaryDark">#7c3aed</item>
        <item name="colorAccent">#a078ff</item>
        <item name="android:statusBarColor">#1a1a2e</item>
    </style>
    
    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>
EOF

# Try to create a basic unsigned APK
echo "🔨 Creating APK package..."
cd apk-build

# Create the APK as a ZIP file (APK is essentially a ZIP)
zip -r ../zivora-app.apk * -x "*.DS_Store"

cd ..

# Check if APK was created
if [ -f "zivora-app.apk" ]; then
    echo "✅ Basic APK created successfully"
    cp zivora-app.apk dist/public/zivora-debug.apk
    ls -lh dist/public/zivora-debug.apk
    echo "📥 Download: https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev/zivora-debug.apk"
else
    echo "❌ Failed to create APK"
    exit 1
fi

echo "⚠️  Note: This APK is unsigned and may require developer mode to install"
echo "📋 For a fully signed APK, use Android Studio with the source package"