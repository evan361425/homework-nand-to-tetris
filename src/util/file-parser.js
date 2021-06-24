import * as fs from 'fs';
import * as path from 'path';
import { createInterface as readLine } from 'readline';
import { MemorySegment } from '../vm-translator/memory-segment.js';

export class FileParser {
  /**
   * @param {string} source
   */
  constructor(source) {
    // throw error if not exist
    const fstat = fs.statSync(source);

    const sources = fstat.isDirectory()
      ? this.getSysFile(source)
      : [this.validateFile(source)];

    this.sources = sources;
  }

  /**
   * @param {action} action
   * @return {Promise<number>} resolve with line index
   */
  async parse(action) {
    let lineIndex = 0;

    for (const source of this.sources) {
      lineIndex += await this.parseFile(action, source);
    }

    return lineIndex;
  }

  parseFile(action, source) {
    return new Promise((res) => {
      MemorySegment.setStaticFile(source);
      let lineIndex = 0;

      readLine({
        input: fs.createReadStream(source),
        crlfDelay: Infinity,
      })
        .on('line', (line) => {
          lineIndex++;
          line = this.sanitize(line);
          if (line === null) return;

          action(line);
        })
        .on('close', () => {
          console.log(`Finish parsing ${source}`);
          res(lineIndex);
        });
    });
  }

  /**
   * @param {string} source
   * @return {string[]}
   */
  getSysFile(source) {
    const sysPath = path.join(source, 'Sys.vm');

    if (!fs.existsSync(sysPath)) {
      throw new Error(`Cannot find Sys.vm in ${source}`);
    }

    const files = fs
      .readdirSync(source)
      .filter((file) => path.extname(file) === '.vm')
      .sort((file1, file2) =>
        file1 === 'Sys.vm' ? -1 : file2 === 'Sys.vm' ? 1 : 0,
      )
      .map((file) => path.join(source, file));

    return files;
  }

  /**
   * @param {string} source
   * @return {string}
   */
  validateFile(source) {
    if (path.extname(source) !== '.vm') {
      throw new Error(`${source} has wrong extension`);
    }
    return source;
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
