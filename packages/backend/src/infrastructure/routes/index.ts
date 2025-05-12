import { Router } from 'express';

const router = Router();

// Rutas de autenticación
// TODO: Implementar controladores reales
router.post('/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

router.get('/auth/me', (req, res) => {
  res.json({ message: 'Current user endpoint' });
});

// Rutas de usuarios
router.get('/users/:id', (req, res) => {
  res.json({ message: `Get user with ID: ${req.params.id}` });
});

router.put('/users/:id', (req, res) => {
  res.json({ message: `Update user with ID: ${req.params.id}` });
});

// Exportar router
export default router; 