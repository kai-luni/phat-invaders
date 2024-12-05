const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');

// SSL Certificates
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/invade.phat-invaders.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/invade.phat-invaders.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/invade.phat-invaders.com/chain.pem'),
};

const app = express();

// Serve static files (your HTML, CSS, and JS files)
app.use(express.static(path.join(__dirname, 'dist')));

// Default route for the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/game.html')); // Adjust the path as needed
});

// HTTP Server
const HTTP_PORT = 3002; // You can change this to another port if needed
http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on http://localhost:${HTTP_PORT}`);
});

// HTTPS Server
const HTTPS_PORT = 3443; // You can change this to another port if needed
https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${HTTPS_PORT}`);
});
