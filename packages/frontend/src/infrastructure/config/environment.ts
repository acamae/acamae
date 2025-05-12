import { Environment } from '@domain/types/environment';
import { z } from 'zod';

// Esquema de validación para variables de entorno del frontend
const envSchema = z.object({
  APP_LANG: z.string().default('es'),
  AUTH_TOKEN_KEY: z.string().default('auth_token'),
  CYPRESS_BASE_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']).default('development'),
  REACT_APP_API_TIMEOUT: z.string().default('10000').transform(Number),
  REACT_APP_API_URL: z.string().min(1, 'REACT_APP_API_URL es obligatoria'),
  REACT_APP_ENABLE_ANALYTICS: z.string().default('false').transform(v => v === 'true'),
  REACT_APP_ENABLE_DEBUG_TOOLS: z.string().default('false').transform(v => v === 'true'),
  REACT_APP_ENABLE_WEB_VITALS: z.string().default('false').transform(v => v === 'true'),
  REACT_APP_ENV: z.string().default('development'),
  REACT_APP_PORT: z.string().default('3000').transform(Number),
  REACT_APP_RECAPTCHA_SITE_KEY: z.string().default(''),
  REACT_APP_WDS_SOCKET_PORT: z.string().default('3000').transform(Number),
  REFRESH_TOKEN_KEY: z.string().default('refresh_token'),
});

// Validar las variables de entorno
const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error('❌ Variables de entorno inválidas:');
  console.error(envResult.error.format());
  throw new Error('Variables de entorno inválidas');
}

// Adaptar el resultado a la interfaz Environment
const env: Environment = envResult.data;
export default env;