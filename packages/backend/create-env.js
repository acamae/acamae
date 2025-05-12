const fs = require('fs');
const path = require('path');

const envContent = `# Variables de entorno para el backend
DATABASE_URL="mysql://root:root@database:3306/gestion_esports"
JWT_SECRET="MiClaveSecretaSuperSeguraParaJWT2024"
JWT_EXPIRATION="24h"
VERIFICATION_EXPIRATION="24h"
PASSWORD_RESET_EXPIRATION="1h"
NODE_ENV="development"
PORT=3001`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('Archivo .env creado exitosamente con la variable JWT_SECRET'); 