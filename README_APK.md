# Android APK Build & Download System

This project is configured with automatic Android APK generation via GitHub Actions and a stable download endpoint.

## 📱 Download APK

**Stable Download Link:** 
```
https://<your-replit-domain>.replit.app/download/apk
```

## 🚀 How to Trigger APK Builds

### Method 1: GitHub Release (Recommended)
1. Go to your GitHub repository
2. Create a new release (e.g., v1.0.0)
3. GitHub Actions will automatically build and attach the APK to the release

### Method 2: Manual Trigger
1. Go to your GitHub repository
2. Navigate to "Actions" tab
3. Select "Build Android APK" workflow
4. Click "Run workflow" → "Run workflow"
5. APK will be available at the download link after ~5-10 minutes

## 🔐 Production Signing (Optional)

To generate signed release APKs instead of debug APKs, add these secrets to your GitHub repository:

### Step 1: Generate Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Add GitHub Secrets
Go to GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

- `ANDROID_KEYSTORE_BASE64`: Base64 encoded keystore file
  ```bash
  base64 my-release-key.keystore | tr -d '\n'
  ```
- `ANDROID_KEY_ALIAS`: Your key alias (e.g., "my-key-alias")
- `ANDROID_STORE_PASSWORD`: Keystore password
- `ANDROID_KEY_PASSWORD`: Key password

### Step 3: Build Signed APK
Once secrets are added, all future builds will be signed release APKs instead of debug APKs.

## 🛠 Environment Configuration

### Replit Environment
Set this environment variable in your Replit project:
```
GITHUB_REPO=your-username/your-repo-name
```

Without this, the download endpoint will look for local APK files.

### Local Development
To build APK locally (debug only):
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## 📁 APK File Details

- **Debug APK**: ~8-15 MB, suitable for testing
- **Release APK**: ~5-10 MB, optimized and signed for distribution
- **Download Method**: GitHub release hosting (more reliable than storing in Replit)
- **Caching**: Files are cached by GitHub CDN for fast downloads

## 🔧 Troubleshooting

### APK Not Found (404)
- Ensure `GITHUB_REPO` environment variable is set
- Check that a GitHub release with APK exists
- Try triggering a new build via GitHub Actions

### Build Failures
- Check GitHub Actions logs in your repository
- Ensure all dependencies are properly listed in `package.json`
- Verify Android project structure in `/android` directory

### Large APK Size
- Review included dependencies
- Consider code splitting or removing unused libraries
- Release builds are smaller than debug builds

## 🏗 System Architecture

```
React/Node App → GitHub Actions → APK Build → GitHub Release → Download Endpoint
```

1. **React Frontend**: Built with Vite to `dist/public`
2. **Capacitor**: Wraps web app for native Android
3. **GitHub Actions**: Builds APK on every release/manual trigger
4. **Node Backend**: Serves APK via `/download/apk` endpoint
5. **GitHub Releases**: Hosts APK files with CDN delivery

This setup provides a professional APK distribution system without storing large files in your Replit project.