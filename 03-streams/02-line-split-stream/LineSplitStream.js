const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.current = '';
  }

  _transform(chunk, encoding, callback) {
    const _chunk = chunk.toString('utf8');
    this.current += _chunk;
    const chunksArray = this.current.split(os.EOL);
    const length = chunksArray.length;
    const lastElem = chunksArray.pop();

    if (length > 1) {
      for (const item of chunksArray) {
        this.push(item);
      }
    }
  
    this.current = lastElem;
    callback();
  }

  _flush(callback) {
    this.push(this.current);
    callback();
  }
}

module.exports = LineSplitStream;
