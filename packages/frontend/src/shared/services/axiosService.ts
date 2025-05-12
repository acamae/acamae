import env from '@infrastructure/config/environment';
import { resetSessionTimer } from '@shared/utils/sessionResetter';
import axios, { AxiosHeaders } from 'axios';

/**
 * Instancia de Axios preconfigurada para la comunicación con la API.
 * Incluye manejo automático de token y errores de autenticación.
 */
// Crear una instancia de axios con la configuración centralizada
const api = axios.create({
  baseURL: env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: env.REACT_APP_API_TIMEOUT,
  withCredentials: true, // Para enviar cookies en peticiones CORS
});

// Interceptor de peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener token de autenticación del almacenamiento local
    const token = localStorage.getItem(env.AUTH_TOKEN_KEY);
    
    // Si existe un token, añadirlo a las cabeceras
    if (token) {
      if (!config.headers) config.headers = {} as AxiosHeaders;
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Reiniciar el temporizador de sesión con cada petición
    resetSessionTimer(() => {
      api.get('/auth/me').catch(() => {
        // Ignoramos errores de verificación de sesión
      });
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    // Registrar analíticas si está habilitado
    if (env.REACT_APP_ENABLE_ANALYTICS) {
      // Código para registrar analíticas
      console.log('Analytics tracking enabled for API calls');
    }
    
    // Reiniciar el temporizador de sesión con cada respuesta
    resetSessionTimer(() => {
      api.get('/auth/me').catch(() => {
        // Ignoramos errores de verificación de sesión
      });
    });
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Manejar errores de autenticación (redirección, mostrar mensaje, etc.)
      console.error('Error de autenticación:', error);
      
      // Limpiar token inválido
      localStorage.removeItem(env.AUTH_TOKEN_KEY);
      localStorage.removeItem(env.REFRESH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;

