/**
 * Servicio para mostrar notificaciones toast utilizando Bootstrap
 */
import { ToastType, ToastOptions } from '@domain/types/toast';

interface BootstrapToastOptions {
  autohide?: boolean;
  delay?: number;
}

class ToastService {
  private getToastContainer(position: string): HTMLElement {
    // Posición por defecto
    const defaultPosition = 'bottom-right';
    const positionClass = position || defaultPosition;
    
    // Mapeo de posiciones a clases de Bootstrap
    const positionClassMap: Record<string, string> = {
      'top-left': 'top-0 start-0',
      'top-center': 'top-0 start-50 translate-middle-x',
      'top-right': 'top-0 end-0',
      'bottom-left': 'bottom-0 start-0',
      'bottom-center': 'bottom-0 start-50 translate-middle-x',
      'bottom-right': 'bottom-0 end-0'
    };
    
    const positionClassName = positionClassMap[positionClass] || positionClassMap[defaultPosition];
    
    // Buscar o crear el contenedor para la posición específica
    let container = document.querySelector(`.toast-container.${positionClassName.replace(/ /g, '.')}`) as HTMLElement | null;
    
    if (!container) {
      container = document.createElement('div');
      container.className = `toast-container position-fixed p-3 ${positionClassName}`;
      document.body.appendChild(container);
    }
    
    return container;
  }

  private getToastColorClass(type: ToastType): string {
    const colorClassMap: Record<ToastType, string> = {
      success: 'text-bg-success',
      error: 'text-bg-danger',
      warning: 'text-bg-warning',
      info: 'text-bg-info'
    };
    
    return colorClassMap[type] || '';
  }

  /**
   * Muestra un toast con las opciones especificadas
   */
  show(options: ToastOptions): void {
    const {
      title,
      message,
      type = 'info',
      duration = 5000,
      position = 'bottom-right'
    } = options;

    // Verificar que estamos en el navegador
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      // En entorno de servidor, no mostrar toast
      console.warn('ToastService: No se puede mostrar toast en entorno de servidor');
      return;
    }

    // Obtener el contenedor según la posición
    const container = this.getToastContainer(position);

    // Crear el elemento toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${this.getToastColorClass(type)}`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Construir el HTML del toast
    let toastHtml = '';
    
    // Cabecera solo si hay título
    if (title) {
      toastHtml += `
        <div class="toast-header">
          <strong class="me-auto">${title}</strong>
          <small>${new Date().toLocaleTimeString()}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
    }
    
    // Cuerpo del toast
    toastHtml += `
      <div class="toast-body ${!title ? 'd-flex justify-content-between align-items-center' : ''}">
        ${message}
        ${!title ? '<button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast" aria-label="Close"></button>' : ''}
      </div>
    `;
    
    toastElement.innerHTML = toastHtml;
    
    // Añadir al contenedor
    container.appendChild(toastElement);
    
    // Verificar si bootstrap está disponible
    const bootstrapAvailable = 'bootstrap' in window;
    
    // Inicializar el toast si bootstrap está disponible
    if (bootstrapAvailable) {
      const toastOptions: BootstrapToastOptions = {
        autohide: true,
        delay: duration
      };
      
      try {
        // Acceder a bootstrap de manera segura
        const bootstrap = (window as any).bootstrap;
        if (bootstrap && bootstrap.Toast) {
          const toast = new bootstrap.Toast(toastElement, toastOptions);
          
          // Mostrar el toast
          toast.show();
          
          // Eliminar el elemento cuando se oculte
          toastElement.addEventListener('hidden.bs.toast', () => {
            // Verificar primero si el elemento todavía está en el contenedor
            if (toastElement.parentNode === container) {
              container.removeChild(toastElement);
              
              // Eliminar el contenedor si ya no hay toasts
              if (container.children.length === 0 && container.parentNode === document.body) {
                document.body.removeChild(container);
              }
            }
          });
        } else {
          throw new Error('Bootstrap Toast no disponible');
        }
      } catch (error) {
        console.error('Error al inicializar Bootstrap Toast:', error);
        this.fallbackRemoval(container, toastElement, duration);
      }
    } else {
      console.warn('ToastService: Bootstrap no está disponible');
      this.fallbackRemoval(container, toastElement, duration);
    }
  }

  // Método para eliminar el toast manualmente cuando bootstrap no está disponible
  private fallbackRemoval(container: HTMLElement, toastElement: HTMLElement, duration: number): void {
    setTimeout(() => {
      try {
        // Verificar primero si el elemento todavía está en el contenedor
        if (toastElement.parentNode === container) {
          container.removeChild(toastElement);
          
          // Verificar si el contenedor está en el document.body y no tiene hijos
          if (container.children.length === 0 && container.parentNode === document.body) {
            document.body.removeChild(container);
          }
        }
      } catch (error) {
        console.error('Error al eliminar toast manualmente:', error);
      }
    }, duration);
  }

  // Métodos de conveniencia para diferentes tipos de toast
  success(message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>): void {
    this.show({ message, title, type: 'success', ...options });
  }

  error(message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>): void {
    this.show({ message, title, type: 'error', ...options });
  }

  warning(message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>): void {
    this.show({ message, title, type: 'warning', ...options });
  }

  info(message: string, title?: string, options?: Partial<Omit<ToastOptions, 'message' | 'title' | 'type'>>): void {
    this.show({ message, title, type: 'info', ...options });
  }
}

// Exportar una instancia única
export const Toast = new ToastService();
export default Toast; 