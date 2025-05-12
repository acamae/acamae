import { ToastOptions } from '@domain/types/toast';
import Toast from '@shared/services/toastService';
import { useCallback } from 'react';

/**
 * Hook para usar el servicio de toast de manera más conveniente en componentes funcionales
 */
export const useToast = () => {
  const show = useCallback((options: ToastOptions) => {
    Toast.show(options);
  }, []);

  const success = useCallback((message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>) => {
    Toast.success(message, title, options);
  }, []);

  const error = useCallback((message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>) => {
    Toast.error(message, title, options);
  }, []);

  const warning = useCallback((message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>) => {
    Toast.warning(message, title, options);
  }, []);

  const info = useCallback((message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>) => {
    Toast.info(message, title, options);
  }, []);

  return {
    show,
    success,
    error,
    warning,
    info
  };
};

export default useToast; 