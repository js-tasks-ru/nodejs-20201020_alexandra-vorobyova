const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const parsedUrl = pathname.split('/');

  if (parsedUrl && parsedUrl.length > 1) {
    res.statusCode = 400;
    res.end('Nested path detected');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const readable = fs.createReadStream(filepath);

      readable.on('error', () => {
        if (!fs.existsSync(filepath)) {
          res.statusCode = 404;
          res.end('File doesnt exist');
        }
        readable.close();
      });

      readable.on('end', () => {
        res.statusCode = 200;
        res.end();
      })

      readable.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
