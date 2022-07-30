var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
const path = require('path');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

if ("development" == app.get("env")) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    }
    res.redirect(`https://${req.hostname}:3001${req.url}`);
});

app.get('/', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, '/famtree.html'));
});

app.get('*.js|*.css', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, req.url));
});

app.get('*api/*', async (req, res) => {
    const url = `https://localhost:5001/api/${req.url.split('api/')[1]}`;
    console.log(`fetching api ${url}`);
    await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(error => console.log(error));
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(3001);
