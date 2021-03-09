import * as fs from 'fs';
import * as path from 'path';
import { createInterface as readLine } from 'readline';

export class FileParser {
  /**
   * @param {string} source
   */
  constructor(source) {
    // throw error if not exist
    const fstat = fs.statSync(source);

    if (fstat.isDirectory()) {
      source = this.getSysFile(source);
    }

    if (this.isValidFile(source)) {
      this.source = source;
    } else {
      throw Error('File must have vm extension or Sys.vm in folder');
    }
  }

  /**
   * @param {action} action
   * @return {Promise<number>} resolve with line index
   */
  parse(action) {
    return new Promise((resolve, reject) => {
      let lineIndex = 0;

      readLine({
        input: fs.createReadStream(this.source),
        crlfDelay: Infinity,
      })
        .on('line', (line) => {
          lineIndex++;
          line = this.sanitize(line);
          if (line === null) return;

          action(line);
        })
        .on('close', () => {
          resolve(lineIndex);
          console.log(`Finish parsing`);
        });
    });
  }

  /**
   * @param {string} source
   * @return {string}
   */
  getSysFile(source) {
    const sysPath = path.join(source, 'Sys.vm');

    return fs.existsSync(sysPath) ? sysPath : '';
  }

  /**
   * @param {string} source
   * @return {boolean}
   */
  isValidFile(source) {
    if (source === '') return false;

    return path.extname(source) === '.vm';
  }

  /**
   * @param {string|Buffer} line
   * @return {string}
   */
  sanitize(line) {
    line = this.takeOffComment(line.toString()).trim();
    return line === '' ? null : line;
  }

  /**
   * @param {string} line
   * @return {string}
   */
  takeOffComment(line) {
    const commentIndex = line.indexOf('//');
    if (commentIndex !== -1) {
      line = line.substr(0, commentIndex);
    }
    return line;
  }
}

/**
 * @callback action
 * @param {string} line
 * @return {void}
 */
