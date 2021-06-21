import { mkdirSync, createWriteStream } from 'fs';
import { basename } from 'path';

export class FileWriter {
  /**
   * @param {string} source
   * @param {string|null} extension
   */
  constructor(source, extension = null) {
    if (source !== null) {
      source = `${source.substr(0, source.lastIndexOf('.'))}.${extension}`;
    }
    mkdirSync(basename(source), { recursive: true });
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
