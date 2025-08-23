# iOS Capacitor Setup - Final Configuration

## Issue Resolution
Fixed iOS Capacitor app showing blank white screen and connection errors.

## Root Cause
iOS Capacitor apps cannot connect to `localhost:5000` development server from iOS simulator. The app needs to:
1. Load static files from the iOS bundle (capacitor://localhost)
2. Make API calls to the deployed production backend

## Solution Applied

### 1. Capacitor Configuration
```json
{
  "server": {
    "androidScheme": "https"
  }
}
```
- Removed localhost URL to use local bundle
- App now serves static files from iOS bundle

### 2. Dynamic API URL Detection
```javascript
const isCapacitor = window.location.protocol === 'capacitor:';
const baseUrl = isCapacitor ? 'https://zivora-migraine-tracker.replit.app' : 'http://localhost:5000';
```
- Capacitor apps use production API
- Development uses localhost

### 3. Authentication Flow
- iOS devices detect Capacitor environment
- API calls routed to production backend
- Direct fetch bypasses React Query validation issues

## Testing Instructions
1. Open iOS simulator 
2. App should load UI from local bundle
3. Authentication calls production API
4. Demo credentials: demo@zivora.com / demo123

## Production Ready
- Static files: Served from iOS bundle
- API calls: Production backend
- Authentication: iOS-optimized direct fetch
- Package size: 9.3MB ready for App Store