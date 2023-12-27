import type {AriaAttributes, DOMAttributes} from "react";

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    as?: string | typeof MessageInput;
  }
}