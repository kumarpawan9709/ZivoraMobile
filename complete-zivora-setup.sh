#!/bin/bash

# Complete Zivora iOS Project Setup Script
# Run this after downloading the full Zivora project

echo "🚀 Setting up Zivora iOS Project..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the Zivora project root directory."
    exit 1
fi

echo "📦 Installing npm dependencies..."
npm install

echo "📱 Adding iOS platform..."
npx cap add ios

echo "🔄 Syncing project with iOS..."
npx cap sync ios

echo "🏗️  Installing CocoaPods dependencies..."
cd ios/App
pod install --repo-update
cd ../..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Open Xcode: npx cap open ios"
echo "2. Or manually: open ios/App/App.xcworkspace"
echo "3. Select iOS Simulator target"
echo "4. Press ▶️ to build and run"
echo ""
echo "📋 Bundle ID: com.zivora.migraintracker"
echo "📱 iOS Target: 14.0+"