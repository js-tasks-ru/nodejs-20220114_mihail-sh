const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const setResult = (code, msg) => {
    res.statusCode = code;
    res.end(msg);
  };

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        setResult(400, `Subfolders doesn't support`);
        return;
      }

      if (!fs.existsSync(filepath)) {
        setResult(404, `No such file`);
        return;
      }
      fs.unlink(filepath, (error) => {
        if (error) {
          setResult(500, error.message);
        } else {
          setResult(200, `File removed`);
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
