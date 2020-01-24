const http = require('http');
const fs = require('fs');
const path = require('path');
const networkInterfaces = require('os').networkInterfaces;

const ROOT_DIR = path.join(__dirname, '/..');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');

const getLocalExternalIP = () => [].concat(...Object.values(networkInterfaces()))
    .filter(details => details.family === 'IPv4' && !details.internal)[0].address

function start() {
    http.createServer(function (req, res) {
        if (req.url.match("\.js$")) {
            let scriptPath = path.join(CLIENT_DIR, req.url);
            let fileStream = fs.createReadStream(scriptPath);
            res.writeHead(200, { "Content-Type": "application/javascript" });
            fileStream.pipe(res);
        } else if (req.url.match("\.png$")) {
            let imagePath = path.join(CLIENT_DIR, req.url);
            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/png" });
            fileStream.pipe(res);
        } else if (req.url === '/config') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ webSocketServerIp: getLocalExternalIP() }));
            res.end();
        } else if (req.url === '/scores') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const content = fs.readFileSync('scores.txt').toString('utf8');
            const scores = content.split('\r\n').map(row => {
                const data = row.split('|');
                return { time: data[0], score: data[1], players: data[2] };
            });
            const bests = [];
            bests.push(scores.sort((s1, s2) => s2.time - s1.time).reverse()[0]);
            bests.push(scores.sort((s1, s2) => s2.score - s1.score)[0]);
            res.write(JSON.stringify(bests));
            res.end();
        } else {
            let indexPath = path.join(CLIENT_DIR, 'index.html');
            fs.readFile(indexPath, function (error, html) {
                if (error) {
                    res.writeHead(404);
                    res.write('Contents you are looking are Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(html);
                }

                res.end();
            });
        }
    }).listen(8080, function () {
        console.log(`server start at http://${getLocalExternalIP()}:8080`);
    });
}

module.exports = { start: start };