

export interface IProps {
  prefixCls?: string;
  className?: string;
}

export interface ICommand {
  name: string,
  keyCommand: string,
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>,
  execute: () => void,
}