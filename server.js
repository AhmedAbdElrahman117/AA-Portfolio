// Simple Express server with proper cache headers for testing
// Install: npm install express compression
// Run: node server.js

const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable GZIP compression
app.use(compression());

// Set cache headers based on file type
app.use((req, res, next) => {
    // Get file extension
    const ext = path.extname(req.url).toLowerCase();
    
    // Images - cache for 1 year
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('X-Content-Type-Options', 'nosniff');
    }
    // CSS and JS - cache for 1 year (we use cache busting)
    else if (['.css', '.js'].includes(ext)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('X-Content-Type-Options', 'nosniff');
    }
    // Fonts - cache for 1 year
    else if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('Access-Control-Allow-Origin', '*');
    }
    // JSON - cache for 1 month
    else if (ext === '.json') {
        res.set('Cache-Control', 'public, max-age=2592000');
        res.set('X-Content-Type-Options', 'nosniff');
    }
    // HTML - no cache
    else if (ext === '.html' || ext === '') {
        res.set('Cache-Control', 'no-cache, must-revalidate, max-age=0');
    }
    
    // Add Vary header for better caching
    res.set('Vary', 'Accept-Encoding');
    
    next();
});

// Serve static files
app.use(express.static('.', {
    etag: false,  // We use Cache-Control instead
    lastModified: true
}));

// Start server
app.listen(PORT);
