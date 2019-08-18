import { bold } from './bold';
import { code } from './code';
import { italic } from './italic';
import { link } from './link';
import { quote } from './quote';
import { image } from './image';
import { strikethrough } from './strikethrough';
import { ICommand } from '../Type';

const getCommands: () => ICommand[] = () => [
  bold, image, italic, link, quote, code, strikethrough
]

export {
  getCommands,
}
