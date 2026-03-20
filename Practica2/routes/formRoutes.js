/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

import express from "express";
import { mostrarFormulario, registrarUsuario } from "../controllers/formControllers.js"; //importar funciones o variables desestructuracion

const router = express.Router();

router.get("/", mostrarFormulario);
router.post('/registro',registrarUsuario);

export default router; //la variable sera visible para otros modulos del proyecto