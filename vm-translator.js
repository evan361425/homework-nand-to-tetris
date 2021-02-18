const fs = require('fs');
const readline = require('readline');
const { Translator } = require('./vm-translator/translator');
const { MemorySegment } = require('./vm-translator/memory-segment');

// 0: node, 1: current file
const source = process.argv[2];

if (!source) {
  throw Error('you should give me input file!');
}

fs.stat(source, (err) => {
  if (err) {
    throw err;
  }

  const translator = new VMTranslator(source);

  console.log(`Reading file ${source}`);
  translator.read();
});

class VMTranslator {
  /**
   * @constructor
   * @param {string} source
   */
  constructor(source) {
    MemorySegment.setStaticFile(source);

    const target = `${source.substr(0, source.lastIndexOf('.'))}.asm`;
    this.sourceStream = fs.createReadStream(source);
    this.targetStream = fs.createWriteStream(target);

    this.index = 0;
  }

  start() {
    readline.createInterface({
      input: this.sourceStream,
      crlfDelay: Infinity,
    }).on('line', (line) => {
      this.index++;
      line = this.sanitize(line);
      if (line === null) return;

      this.translate(line);
    }).on('close', () => {
      console.log(`Wrote to ${target}`);
    });
  }

  translate(line) {
    try {
      const asmLine = Translator.translate(line);
      this.targetStream.write(`// ${line}\n${asmLine}\n`);
    } catch (err) {
      throw new Error(`${line}\nline index: ${this.index}\n${err.message}`);
    }
  }

  sanitize(line) {
    line = line.toString().trim();
    return line === '' || line.startsWith('//') ? null : line;
  }
}
