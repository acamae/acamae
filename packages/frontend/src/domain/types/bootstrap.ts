/**
 * Tipos para Bootstrap 5
 */

export interface ToastOptions {
  animation?: boolean;
  autohide?: boolean;
  delay?: number;
}

export interface ToastInstance {
  show(): void;
  hide(): void;
  dispose(): void;
}

export interface ToastStatic {
  new(element: Element, options?: ToastOptions): ToastInstance;
  getInstance(element: Element): ToastInstance | null;
  getOrCreateInstance(element: Element, options?: ToastOptions): ToastInstance;
}

export interface BootstrapStatic {
  Toast: ToastStatic;
  Modal: any;
  Popover: any;
  Tooltip: any;
  Alert: any;
  Carousel: any;
  Collapse: any;
  Dropdown: any;
  Offcanvas: any;
  Tab: any;
}

declare global {
  interface Window {
    bootstrap: BootstrapStatic;
  }
} 