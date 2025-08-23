# Zivora Launch Screen Animations

## 🎨 Animation Files Used

### 1. **Native iOS Launch Screen** (LaunchScreen.storyboard)
- **Static Elements**: Purple circle logo + "ZIVORA" text
- **Background**: #1a1a2e (Dark navy)
- **No animations** - iOS native launch screens don't support animations

### 2. **React Loading Screen Animations** (LoadingScreen.tsx)

#### CSS Animations Used:
```css
/* Bouncing dots animation */
.animate-bounce {
  animation: bounce 1s infinite;
}

/* Pulse animation for logo */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade-in animation */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}
```

#### Loading Dots Animation:
```jsx
<div className="flex space-x-2 mt-8">
  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
</div>
```

### 3. **Animated SVG Files**

#### **Animated Loading Dots** (zivora-animated-loading-dots.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 60 20" fill="none">
  <circle cx="10" cy="10" r="3" fill="#a078ff">
    <animate attributeName="opacity" dur="1.5s" values="0.3;1;0.3" repeatCount="indefinite" begin="0s"/>
    <animate attributeName="r" dur="1.5s" values="3;4;3" repeatCount="indefinite" begin="0s"/>
  </circle>
  <circle cx="30" cy="10" r="3" fill="#a078ff">
    <animate attributeName="opacity" dur="1.5s" values="0.3;1;0.3" repeatCount="indefinite" begin="0.3s"/>
    <animate attributeName="r" dur="1.5s" values="3;4;3" repeatCount="indefinite" begin="0.3s"/>
  </circle>
  <circle cx="50" cy="10" r="3" fill="#a078ff">
    <animate attributeName="opacity" dur="1.5s" values="0.3;1;0.3" repeatCount="indefinite" begin="0.6s"/>
    <animate attributeName="r" dur="1.5s" values="3;4;3" repeatCount="indefinite" begin="0.6s"/>
  </circle>
</svg>
```

#### **Pulsing Logo** (zivora-pulsing-logo.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.8">
    <animate attributeName="r" dur="2s" values="45;48;45" repeatCount="indefinite"/>
    <animate attributeName="opacity" dur="2s" values="0.8;1;0.8" repeatCount="indefinite"/>
  </circle>
  <text x="50" y="60" font-family="Arial" font-size="28" font-weight="bold" 
        text-anchor="middle" fill="white">Z</text>
</svg>
```

## 🔧 Color Values Used:
- **Background**: `#1a1a2e` (Dark navy)
- **Purple accent**: `#a078ff` (Purple-400)
- **Text**: `#ffffff` (White)

## 📱 Animation Sequence:
1. **iOS Launch** - Static Zivora logo appears instantly
2. **React Loading** - Animated bouncing dots with 0.1s delays
3. **Logo Pulse** - Gentle pulsing animation on logo
4. **Fade-in** - Smooth text appearance

The animations are lightweight CSS-based transitions that provide smooth visual feedback during the loading process.