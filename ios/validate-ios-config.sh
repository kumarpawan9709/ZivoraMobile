#!/bin/bash
echo "🔍 Validating iOS Configuration..."

# Check bundle identifier pattern
if grep -q "com\.zivora\.migrainertracker" App/App.xcodeproj/project.pbxproj; then
    echo "✅ Bundle ID format is correct"
else
    echo "❌ Bundle ID pattern issue found"
fi

# Check Info.plist URL schemes
if grep -q "CFBundleURLSchemes" App/App/Info.plist; then
    echo "✅ URL schemes configured"
else
    echo "❌ URL schemes missing"
fi

# Check for entitlements
if [ -f "App/App/App.entitlements" ]; then
    echo "✅ Entitlements file exists"
else
    echo "❌ Entitlements file missing"
fi

echo "📋 Validation complete"
