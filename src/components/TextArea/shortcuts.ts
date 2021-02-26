import { ICommand } from '../../commands';
type Shortcuts = Record<string, ICommand['execute']>;

export default (e: React.KeyboardEvent<HTMLTextAreaElement>, data: Shortcuts = {}) => {};
