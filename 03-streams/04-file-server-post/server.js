//npm test -- --grep "streams/file-server-post"
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream.js');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const setResult = (code, msg) => {
    res.statusCode = code;
    res.end(msg);
  };

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        setResult(400, `Subfolders doesn't support`);
        return;
      }
      if (fs.existsSync(filepath)) {
        setResult(409, `File already exists`);
        return;
      }

      const stream = fs.createWriteStream(filepath);
      const transformStream = new LimitSizeStream({ limit: 1048576, });
      req.on('aborted', () => {
        stream.destroy();
        fs.unlink(filepath, () => { });
      });

      req
        .pipe(transformStream)
        .on('error', (error) => {
          stream.destroy();
          transformStream.destroy();
          fs.unlink(filepath, () => { });
          if (error.code === 'LIMIT_EXCEEDED') {
            setResult(413, error.message);
          } else {
            setResult(500, error.message);
          }
        })
        .pipe(stream)
        .on('error', () => {
          stream.destroy();
          fs.unlink(filepath, () => { });
          setResult(500, error.message);
        })
        .on('finish', () => setResult(201, `File saved`));
      break;

    default:
      setResult(501, `Not implemented`);
  }
});

module.exports = server;
