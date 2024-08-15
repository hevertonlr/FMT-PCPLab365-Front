export interface Toast {
  type: string;
  title: string;
  message: string;
  icon: string;
  enter?: boolean;
  leave?: boolean;
  show?: boolean;
}
