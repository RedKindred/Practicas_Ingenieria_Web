/**
 * APIREST
 * 
 * Arquitecta básica
 * 
 *   Models - Operaciones CRUD en la tablas Users
 *   Routes - Cada ruta accede a una operación
 *            en la BD.
 *   Controllers - gestiona la petición y determina
 *              - que operación debe ejecutarse y
 *              - retorna los datos.
 *    Config - configurar las conexiones a las BD:
 *             MySQL y SQLServer
 *   
 *   Métodos HTTP: GET | POST | PUT | DELETE 
 * 
 *   Conector a BD - MySQL y SQLServer
 *      
 *   Thunderclient 
 */


import express from 'express';
import dotenv from 'dotenv';
import usersRoutes from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.json());

// http://localhost:5000/api/
app.use('/api', usersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});