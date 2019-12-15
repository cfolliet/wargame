const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '/..');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');

function start() {
    http.createServer(function (req, res) {
        if (req.url.match("\.js$")) {
            let  imagePath = path.join(CLIENT_DIR, req.url);
            let  fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "application/javascript" });
            fileStream.pipe(res);
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
        console.log("server start at port 8080 => http://localhost:8080");
    });
}

module.exports = { start: start };