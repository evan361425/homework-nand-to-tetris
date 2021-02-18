export class Bitwise {
  static neg() {
    return new Action([
      '@SP',
      'A=M-1', // negative last element
      'M=-M',
    ]);
  }

  static not() {
    return new Action([
      '@SP',
      'A=M-1', // negative last element
      'M=!M',
    ]);
  }
}
