# Zivora App Store Preparation Guide

## Bundle ID & App Configuration

**Bundle ID:** `com.zivora.migrainertracker`
**App Name:** Zivora
**Platform:** iOS & Android (Capacitor hybrid app)

## App Store Information

### Basic App Details
- **Category:** Medical/Health & Fitness
- **Age Rating:** 4+ (Medical information app)
- **Content Rating:** Everyone
- **Pricing:** Free (with potential in-app purchases)

### App Description (Short)
Track migraines, identify triggers, and manage your health with AI-powered insights and comprehensive symptom logging.

### App Description (Full)
Zivora is your comprehensive migraine tracking companion that helps you understand patterns, identify triggers, and take control of your health journey.

**Key Features:**
• Smart Risk Assessment - AI-powered risk scoring based on your health data
• Comprehensive Symptom Logging - Track pain levels, triggers, and medications
• Food & Nutrition Tracking - Log meals and identify food-related triggers  
• Pattern Analysis - Discover trends and correlations in your health data
• Health Reports - Generate detailed reports for healthcare providers
• Secure Profile Management - Keep your health data private and secure

**Why Choose Zivora:**
- Evidence-based tracking methods
- Intuitive, easy-to-use interface
- Comprehensive health insights
- Export data for medical consultations
- Privacy-focused design

Perfect for migraine sufferers who want to take an active role in managing their condition with data-driven insights.

### Keywords
migraine, headache, health, tracker, symptoms, triggers, pain, medical, wellness, diary, log, analysis, patterns, food, nutrition

## Technical Setup Status

### ✅ Completed Setup
- Bundle ID configured: `com.zivora.migrainertracker`
- Capacitor configuration created
- iOS platform initialized
- Build system configured
- Web assets compiled to `dist/public`

### App Icons & Screenshots Needed
1. **App Icon Sizes (iOS):**
   - 1024x1024 (App Store)
   - 180x180 (iPhone)
   - 120x120 (iPhone)
   - 87x87 (iPhone Settings)
   
2. **Screenshot Sizes:**
   - iPhone 6.7": 1290x2796 or 2796x1290
   - iPhone 6.5": 1242x2688 or 2688x1242
   - iPhone 5.5": 1242x2208 or 2208x1242
   - iPad Pro 12.9": 2048x2732 or 2732x2048

### App Store Screenshots Needed
Based on Figma designs, create screenshots showing:
1. **Onboarding Flow** - Welcome screens
2. **Dashboard** - Main health overview
3. **Symptom Logging** - Pain tracking interface
4. **Food Tracking** - Nutrition logging
5. **Analytics** - Charts and insights
6. **Profile** - Settings and preferences

## Next Steps for Publication

### 1. Development Completion
- [ ] Complete all app functionality testing
- [ ] Implement app store required features
- [ ] Add privacy policy and terms of service links
- [ ] Test on physical iOS devices

### 2. App Store Assets
- [ ] Create app icon in all required sizes
- [ ] Take 5-6 app store screenshots
- [ ] Write app store description
- [ ] Prepare app preview video (optional)

### 3. Apple Developer Account
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Create App Store Connect listing
- [ ] Set up provisioning profiles
- [ ] Configure app certificates

### 4. Build & Submission
```bash
# Build for production
npm run build

# Sync with Capacitor  
npx cap sync ios

# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Set bundle identifier: com.zivora.migrainertracker
# 2. Configure signing & capabilities
# 3. Archive for App Store submission
```

### 5. App Store Review
- [ ] Submit for review
- [ ] Respond to any review feedback
- [ ] Plan marketing launch

## Configuration Files

### capacitor.config.json
```json
{
  "appId": "com.zivora.migrainertracker",
  "appName": "Zivora",
  "webDir": "dist/public"
}
```

### Bundle ID Details
- **Identifier:** com.zivora.migrainertracker
- **Domain:** zivora.com (recommended to own this domain)
- **Type:** Reverse domain notation
- **Platform:** Universal (iOS + Android)

## Important Notes

1. **Domain Ownership:** Consider purchasing `zivora.com` domain for brand consistency
2. **Privacy Compliance:** Ensure HIPAA/medical data privacy compliance
3. **Testing:** Test thoroughly on real devices before submission
4. **Marketing:** Prepare app store optimization (ASO) strategy

## Contact Information
For app store submission support, ensure you have:
- Valid Apple Developer Account
- Proper signing certificates
- All required app assets
- Privacy policy hosted online