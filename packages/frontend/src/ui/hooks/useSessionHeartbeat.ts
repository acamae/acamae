import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook que verifica la validez de la sesión a intervalos regulares
 * 
 * @param options Opciones de configuración
 * @param options.intervalMs Intervalo entre comprobaciones en milisegundos, por defecto 5 minutos
 * @param options.redirectTo Ruta a la que redirigir si la sesión expira, por defecto '/login'
 * @param options.onSessionExpired Callback personalizado que se ejecuta si la sesión ha expirado
 * @param options.replaceHistory Si es true, reemplaza la entrada actual del historial al redirigir
 */
const useSessionHeartbeat = (options: {
  intervalMs?: number;
  redirectTo?: string;
  onSessionExpired?: () => void;
  replaceHistory?: boolean;
} = {}) => {
  const {
    intervalMs = 5 * 60 * 1000,
    redirectTo = '/login',
    onSessionExpired,
    replaceHistory = true
  } = options;
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 440 || response.status === 401) {
            // Sesión expirada o no iniciada
            if (onSessionExpired) {
              // Si hay un callback personalizado, lo ejecutamos
              onSessionExpired();
            } else {
              // Si no hay callback, redirigimos a la ruta configurada
              navigate(redirectTo, { replace: replaceHistory });
            }
          }
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
      }
    };

    // Ejecuta inmediatamente y luego cada intervalo
    checkSession();
    const intervalId = setInterval(checkSession, intervalMs);

    return () => clearInterval(intervalId);
  }, [navigate, intervalMs, redirectTo, onSessionExpired, replaceHistory]);
};

export default useSessionHeartbeat;
