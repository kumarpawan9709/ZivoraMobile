import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";

const app = express();

// Performance optimizations for faster startup
app.use(express.json({ 
  limit: '10mb', // Reduced from 50mb for faster parsing
  strict: false // Allow more flexible JSON parsing
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: '10mb', // Reduced from 50mb
  parameterLimit: 100 // Limit URL parameters for security & speed
}));

// Disable x-powered-by header for minor performance gain
app.disable('x-powered-by');

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add specific routes for APK download files
app.get('/zivora-*.apk', (req, res) => {
  const filename = req.path.substring(1);
  const filePath = path.join(process.cwd(), 'dist', 'public', filename);
  
  console.log(`APK download request for: ${filename}`);
  console.log(`Looking for APK file at: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`APK file found, size: ${stats.size} bytes`);
    
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size.toString());
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.resolve(filePath));
  } else {
    console.log('APK file not found');
    res.status(404).send('APK file not found');
  }
});

// Add specific routes for iOS download files
app.get('/zivora-ios-*.tar.gz', (req, res) => {
  const filename = req.path.substring(1);
  const filePath = path.join(process.cwd(), 'dist', 'public', filename);
  
  console.log(`Download request for: ${filename}`);
  console.log(`Looking for file at: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`File found, size: ${stats.size} bytes`);
    
    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size.toString());
    res.sendFile(path.resolve(filePath));
  } else {
    console.log('File not found');
    res.status(404).send('File not found');
  }
});

app.get('/zivora-*.zip', (req, res) => {
  const filename = req.path.substring(1);
  const filePath = path.join(process.cwd(), 'dist', 'public', filename);
  
  console.log(`ZIP Download request for: ${filename}`);
  console.log(`Looking for ZIP file at: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`ZIP File found, size: ${stats.size} bytes`);
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size.toString());
    res.sendFile(path.resolve(filePath));
  } else {
    console.log('ZIP File not found');
    res.status(404).send('File not found');
  }
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  
  // Performance optimizations for instant startup
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
    backlog: 511, // Increase connection backlog
    keepAlive: true, // Enable keep-alive for better performance
    keepAliveInitialDelay: 30000 // 30 second keep-alive
  }, () => {
    const startup_time = process.uptime();
    log(`🚀 serving on port ${port} (startup: ${startup_time.toFixed(2)}s)`);
    
    // Preload critical routes for instant response
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        // Self-warm the server
        fetch(`http://localhost:${port}/api/health`).catch(() => {});
      }, 100);
    }
  });
})();
