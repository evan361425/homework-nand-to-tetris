import { createWriteStream, statSync } from 'fs';
import { basename, join } from 'path';

export class FileWriter {
  /**
   * @param {string} source
   * @param {string|null} extension
   */
  constructor(source, extension = null) {
    const fstat = statSync(source);

    if (fstat.isDirectory()) {
      source = join(source, basename(source) + '.asm');
    } else {
      source = `${source.substr(0, source.lastIndexOf('.'))}.${extension}`;
    }

    console.log(`Connect to file ${source}`);
    this.stream = createWriteStream(source);
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
