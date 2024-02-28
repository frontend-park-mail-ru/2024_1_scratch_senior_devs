const fs = require('fs');
const http = require('http');
const path = require("path");
const SERVER_PORT = 3000

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'woff': 'application/font-woff',
    'woff2': 'application/font-woff2',
    'ttf': 'application/font-ttf',
    'eot': 'application/vnd.ms-fontobject',
    'otf': 'application/font-otf',
    'swf': 'application/x-shockwave-flash',
    'wasm': 'application/wasm'
}

const staticFile = (res, filePath, ext) => {
    res.setHeader("Content-Type", mimeTypes[ext])
    fs.readFile("./public" + filePath, (error, data) => {
        if (error) {
            res.statusCode = 404
            res.end()
        }

        res.end(data)
    })
}


const server = http.createServer((req, res) => {
    const {url} = req

    const extname = String(path.extname(url)).toLocaleLowerCase()
    if (extname in mimeTypes) {
        staticFile(res, url, extname)
    } else {
        staticFile(res, "/index.html", ".html")
    }

})

server.listen(SERVER_PORT);
console.log("Server listening 3000");
console.log("http://localhost:3000");