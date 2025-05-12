// Interfaz para variables de entorno del frontend
export interface Environment {
  APP_LANG: string;
  AUTH_TOKEN_KEY: string;
  CYPRESS_BASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  REACT_APP_API_TIMEOUT: number;
  REACT_APP_API_URL: string;
  REACT_APP_ENABLE_ANALYTICS: boolean;
  REACT_APP_ENABLE_DEBUG_TOOLS: boolean;
  REACT_APP_ENABLE_WEB_VITALS: boolean;
  REACT_APP_ENV: string;
  REACT_APP_PORT: number;
  REACT_APP_RECAPTCHA_SITE_KEY: string;
  REACT_APP_WDS_SOCKET_PORT: number;
  REFRESH_TOKEN_KEY: string;
}