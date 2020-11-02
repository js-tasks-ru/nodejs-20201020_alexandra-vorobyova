const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const parsedUrl = pathname.split('/');

  if (parsedUrl && parsedUrl.length > 1) {
    res.statusCode = 400;
    return res.end('Nested path detected');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    return res.end('File already exists');
  }

  switch (req.method) {
    case 'POST':
      const writable = fs.createWriteStream(filepath);
      const limitSizeStream = new LimitSizeStream({ limit: 10000 });

      req.pipe(limitSizeStream).on('error', (err) => {
        fs.unlinkSync(filepath);
        if (err instanceof(LimitExceededError)) {
          res.statusCode = 413;
          return res.end();
        }
        res.statusCode = 500;
        res.end();
      }).pipe(writable).on('close', () => {
        res.statusCode = 201;
        res.end();
      });

      req.on('close', () => {
        if (req.aborted) {
          fs.unlinkSync(filepath);
          return;
        }
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

});

module.exports = server;
