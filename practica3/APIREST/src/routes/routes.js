import { Router } from 'express';
import * as crudSQL from '../controllers/usersSQLServer.js';
const router = Router();

// http://localhost:5000/api/mysql/users
router.get('/sqlserver/users', crudSQL.getUsers);
router.get('/sqlserver/users/:correo', crudSQL.findByEmail);

/**
  {
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "contrasena": "12345678",
  "preguntarc": "¿Nombre de tu primera mascota?",
  "respuestarc": "Firulais"
}
 * 
 */

router.post('/sqlserver/users', crudSQL.registerUser);
router.put('/sqlserver/users/:correo', crudSQL.updatePassword);
export default router;
