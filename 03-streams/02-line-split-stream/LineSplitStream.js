const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._last = '';
  }

  _transform(chunk, encoding, callback) {
    const lines = (this._last + chunk.toString('utf-8')).split(os.EOL);
    this._last = lines.pop();
    lines.forEach((line) => this.push(line));
    callback();
  }

  _flush(callback) {
    callback(null, this._last);
  }
}

module.exports = LineSplitStream;
