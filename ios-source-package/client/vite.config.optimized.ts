import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readdirSync, statSync } from "fs";

// Performance optimizations for instant builds
export default defineConfig({
  plugins: [
    react({
      // Skip JSX runtime in production for smaller bundles
      jsxRuntime: process.env.NODE_ENV === 'production' ? 'classic' : 'automatic'
    })
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets")
    }
  },
  
  // Aggressive build optimizations
  build: {
    target: 'esnext', // Use latest JS features for smaller bundles
    minify: 'esbuild', // Fastest minifier
    cssMinify: true,
    
    // Reduce bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    },
    
    // Smaller assets = faster loading
    assetsInlineLimit: 2048, // Inline small assets
    chunkSizeWarningLimit: 1000, // Warn on large chunks
    sourcemap: false, // No sourcemaps in production for speed
    reportCompressedSize: false // Skip compression reporting for faster builds
  },
  
  // Development optimizations
  server: {
    hmr: {
      port: 24678 // Dedicated HMR port for reliability
    }
  },
  
  // Dependency optimization for faster dev startup
  optimizeDeps: {
    // Pre-bundle heavy dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'wouter',
      'zod'
    ],
    // Exclude problematic packages from optimization
    exclude: [
      '@capacitor/core',
      '@capacitor/splash-screen'
    ]
  },
  
  // Caching for instant rebuilds
  cacheDir: '.vite-cache'
});