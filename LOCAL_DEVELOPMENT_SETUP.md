# Local Development Setup Guide for Zivora App

## Prerequisites
Before running the downloaded project locally, ensure you have:
- Node.js (v16 or higher)
- Xcode (latest version)
- iOS Simulator
- PostgreSQL database access

## Step-by-Step Setup

### 1. Extract and Install Dependencies
```bash
# Navigate to your project directory
cd zivora-app

# Install all dependencies
npm install

# Install Capacitor CLI globally if not already installed
npm install -g @capacitor/cli
```

### 2. Environment Configuration
Create a `.env` file in the root directory with these variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# API Configuration
VITE_API_URL=http://localhost:5000
NODE_ENV=development

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important:** Get the actual `DATABASE_URL` and `JWT_SECRET` from your Replit environment variables.

### 3. Database Setup Options

#### Option A: Use Replit's Database (Recommended)
- Copy the exact `DATABASE_URL` from Replit
- No additional setup needed
- Ensure your local IP is allowed to connect

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or use your preferred installation method

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb zivora

# Update DATABASE_URL in .env to point to local database
DATABASE_URL=postgresql://localhost:5432/zivora
```

### 4. iOS Configuration for Local Development

#### Update Capacitor Config
Create or modify `capacitor.config.json`:

```json
{
  "appId": "com.zivora.app",
  "appName": "Zivora",
  "webDir": "dist/public",
  "server": {
    "url": "http://localhost:5000",
    "cleartext": true
  },
  "ios": {
    "contentInset": "automatic",
    "scrollEnabled": true,
    "allowsLinkPreview": false,
    "handleApplicationURL": false,
    "preferredContentMode": "mobile"
  }
}
```

#### iOS Info.plist Configuration
Open `ios/App/App/Info.plist` and add/modify:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSAllowsLocalNetworking</key>
    <true/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>localhost</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.0</string>
            <key>NSIncludesSubdomains</key>
            <true/>
        </dict>
    </dict>
</dict>
```

### 5. Build and Run

#### Terminal 1 - Start Development Server
```bash
# Start the backend and frontend
npm run dev

# Verify server is running
curl http://localhost:5000/api/health
```

#### Terminal 2 - iOS Setup
```bash
# Build the web assets
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 6. Xcode Configuration

1. **Select Device**: Choose an iOS Simulator (iPhone 14 Pro recommended)
2. **Build Settings**: Ensure "Allow Arbitrary Loads" is enabled
3. **Clean Build**: Product → Clean Build Folder (⇧⌘K)
4. **Run**: Click the Run button (⌘R)

### 7. Common Issues and Solutions

#### Issue: "Cannot connect to server"
```bash
# Check if server is running
lsof -i :5000

# If not running, start development server
npm run dev

# Test API endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Issue: "Database connection failed"
- Verify `DATABASE_URL` in `.env` file
- Test database connection:
```bash
# Install PostgreSQL client
npm install -g pg

# Test connection (replace with your DATABASE_URL)
psql "postgresql://username:password@host:port/database"
```

#### Issue: "Network request failed in iOS"
1. Check iOS Console in Xcode: Window → Devices and Simulators
2. Verify `NSAllowsLocalNetworking` in Info.plist
3. Ensure Capacitor server URL is correct

#### Issue: "CORS errors"
Add to your local server configuration (if modified):
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'capacitor://localhost', 'ionic://localhost'],
  credentials: true
}));
```

### 8. Testing Login Functionality

#### Test API Directly
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Debug iOS Network Requests
1. Open Safari Developer Tools
2. Connect to iOS Simulator
3. Monitor network requests in Web Inspector

### 9. Environment Differences

| Feature | Replit | Local Development |
|---------|--------|-------------------|
| API URL | Auto-configured | http://localhost:5000 |
| Database | Replit PostgreSQL | Local or Remote DB |
| HTTPS | Automatic | HTTP (development) |
| CORS | Configured | May need adjustment |

### 10. Final Checklist

Before running in Xcode simulator:
- [ ] `npm install` completed successfully
- [ ] `.env` file created with proper variables
- [ ] `npm run dev` running without errors
- [ ] Database connection verified
- [ ] `npx cap sync ios` completed
- [ ] iOS Info.plist updated for local networking
- [ ] Xcode project opens without build errors

## Troubleshooting Commands

```bash
# Check running processes
lsof -i :5000

# Check Capacitor status
npx cap doctor

# Reset iOS simulator
xcrun simctl erase all

# Clean Capacitor cache
npx cap clean ios

# Rebuild everything
rm -rf node_modules package-lock.json
npm install
npm run build
npx cap sync ios
```

## Support

If you continue experiencing issues:
1. Check the server logs when attempting login
2. Review iOS Console for specific error messages
3. Verify environment variables match Replit configuration
4. Test API endpoints directly with curl commands

The key difference between Replit and local development is the network configuration and environment variables setup.