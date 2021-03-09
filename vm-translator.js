import { Translator } from './src/vm-translator/translator.js';
import { MemorySegment } from './src/vm-translator/memory-segment.js';
import { FileParser } from './src/util/file-parser.js';
import { FileWriter } from './src/util/file-writer.js';

// 0: node, 1: current file
const source = process.argv[2];

if (!source) {
  throw Error('missing argument: VM file or directory');
}

const parser = new FileParser(source);
const writer = new FileWriter(source, 'asm');
MemorySegment.setStaticFile(parser.source);

parser
  .parse((line) => {
    writer.write(`// ${line}\n${Translator.translate(line)}`);
  })
  .then((lineNumber) => {
    console.log(`Total line number: ${lineNumber}`);
    writer.close();
  });
