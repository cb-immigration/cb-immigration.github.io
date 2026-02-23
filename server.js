const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');

// Initialize submissions file
if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, '[]');
}

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API endpoint for contact form
    if (pathname === '/api/contact' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                data.timestamp = new Date().toISOString();
                data.id = Date.now();
                
                // Read existing submissions
                const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
                submissions.push(data);
                
                // Save submissions
                fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
                
                console.log('\n=== NOUVELLE DEMANDE ===');
                console.log('Date:', data.timestamp);
                console.log('Nom:', data.nom, data.prenom);
                console.log('Email:', data.email);
                console.log('T\u00e9l\u00e9phone:', data.telephone);
                console.log('Destination:', data.destination);
                console.log('Volet:', data.volet);
                console.log('========================\n');
                
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true, message: 'Demande re\u00e7ue'}));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Invalid data'}));
            }
        });
        return;
    }
    
    // API endpoint to view submissions (admin)
    if (pathname === '/api/submissions' && req.method === 'GET') {
        try {
            const submissions = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(submissions);
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Server error'}));
        }
        return;
    }
    
    // Serve static files
    if (pathname === '/') pathname = '/index.html';
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n\u2705 CB Services - Site web d\u00e9marr\u00e9`);
    console.log(`\ud83c\udf10 URL: http://localhost:${PORT}`);
    console.log(`\ud83d\udcdd Les demandes seront enregistr\u00e9es dans: ${SUBMISSIONS_FILE}`);
    console.log(`\ud83d\udc41  Voir les demandes: http://localhost:${PORT}/api/submissions\n`);
});