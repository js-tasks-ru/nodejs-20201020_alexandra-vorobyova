const url = require('url');
const http = require('http');
const path = require('path');
const { existsSync, unlink } = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const parsedUrl = pathname.split('/');
  
  if (parsedUrl && parsedUrl.length > 1) {
    res.statusCode = 400;
    return res.end('Nested path detected');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (!existsSync(filepath)) {
    res.statusCode = 404;
    return res.end('File doesnt exist');
  }

  switch (req.method) {
    case 'DELETE':
      unlink(filepath, (err) => {
        if (err) {
          res.statusCode = 501;
          return res.end('Error');
        }

        res.statusCode = 200;
        return res.end('Success');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
