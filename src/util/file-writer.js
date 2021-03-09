import * as path from 'path';
import * as fs from 'fs';

function mkdirRecurse(inputPath) {
  if (fs.existsSync(inputPath)) {
    return;
  }
  const basePath = path.dirname(inputPath);
  if (fs.existsSync(basePath)) {
    fs.mkdirSync(inputPath);
  }
  mkdirRecurse(basePath);
}

export class FileWriter {
  /**
   * @param {string} source
   * @param {string|null} extension
   */
  constructor(source, extension = null) {
    if (source !== null) {
      source = `${source.substr(0, source.lastIndexOf('.'))}.${extension}`;
    }
    mkdirRecurse(source);
    console.log(`Connect to file ${source}`);
    this.stream = fs.createWriteStream(source);
  }

  /**
   * @param {string} line
   * @return {void}
   */
  write(line) {
    this.stream.write(`${line}\n`);
  }

  /**
   * @return {void}
   */
  close() {
    this.stream.close();
  }
}
