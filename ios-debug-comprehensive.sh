#!/bin/bash

echo "🔍 COMPREHENSIVE iOS DEBUG CHECK"
echo "================================="

echo ""
echo "📱 Bundle ID Check:"
echo "Capacitor config: $(grep '"appId"' capacitor.config.json)"
echo "Xcode project: $(grep PRODUCT_BUNDLE_IDENTIFIER ios/App/App.xcodeproj/project.pbxproj | head -1)"

echo ""
echo "🔗 URL Schemes:"
grep -A5 "CFBundleURLSchemes" ios/App/App/Info.plist | head -10

echo ""
echo "🔐 Entitlements:"
if [ -f "ios/App/App/App.entitlements" ]; then
    echo "✅ Entitlements file exists"
    grep -A2 "com.apple.developer.applesignin" ios/App/App/App.entitlements || echo "❌ Apple Sign In capability missing"
else
    echo "❌ Entitlements file missing"
fi

echo ""
echo "📋 Info.plist Key Checks:"
echo "Display Name: $(grep -A1 "CFBundleDisplayName" ios/App/App/Info.plist | tail -1)"
echo "Bundle Name: $(grep -A1 "CFBundleName" ios/App/App/Info.plist | tail -1)"

echo ""
echo "🚀 Capacitor iOS Config:"
echo "Scheme: $(grep -A1 '"scheme"' capacitor.config.json | tail -1)"
echo "Handle URLs: $(grep -A1 'handleApplicationURL' capacitor.config.json | tail -1)"

echo ""
echo "✅ DIAGNOSIS COMPLETE"