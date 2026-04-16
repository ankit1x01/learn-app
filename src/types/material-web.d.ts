import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'md-slider': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'md-checkbox': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'md-switch': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'md-fab': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
