//curl -o - --limit-rate 50K http://localhost:3000/test.txt
//npm test -- --grep "streams/file-server-get"
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

  //stream.on('open', () => console.log('Stream Open'));
  //stream.on('close', () => console.log('Stream Close'));

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);

      req.on('aborted', () => {
        stream.destroy();
      });

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          setResult(404, `File does not exist`);
        } else {
          setResult(500, `Something went wrong`);
        }
      });

      if (pathname.includes('/')) {
        setResult(400, `Subfolders doesn't support`);
        stream.destroy();
      }

      stream.pipe(res);
      break;

    default:
      setResult(501, `Not implemented`);
  }

});

module.exports = server;
