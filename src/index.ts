String.prototype.isLowerCase = function () {
  return this === this.toLowerCase();
};
String.prototype.isUpperCase = function () {
  return !this.isLowerCase();
};
String.prototype.isNumber = function () {
  return !isNaN(+this);
};
String.prototype.toCamelCase = function () {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g,
    (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
  ).replace(/\s+|-/g, '');
};

import ShadYantra from './board/ShadYantra';
import ReadLine from 'readline';
const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});


const shadYantra = new ShadYantra();
shadYantra.board.print();
console.log(shadYantra.generateFEN());
shadYantra.move('c2c3');
shadYantra.move('e2e3');

readline.on('line', input => {
  const args = input.trim().split(/ +/);
  console.log(input);
  if (!args.length) return;
  const commandName = args.shift()!.toLowerCase();
  switch (commandName) {
    case 'move':
      console.log(`Moving to ${ args[0] }`);
      // @ts-ignore
      shadYantra.move(args[0]);
      break;
    case 'select':
      const validDestinationSquares = shadYantra.select(args[0]);
      console.log(validDestinationSquares);
      break;

    case 'stop':
      readline.close();
      break;
    default:
      console.log('Not a valid command!');
      break;
  }
});

console.log('Program Exited!');