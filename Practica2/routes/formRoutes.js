import express from "express";
import { mostrarFormulario, registrarUsuario, mostrarLogin, loginUsuario, mostrarRecuperar } from "../controllers/formControllers.js";

const router = express.Router();

router.get("/", mostrarFormulario);
router.post('/registro',registrarUsuario);
router.get('/registro',registrarUsuario);

// Recuperar contraseña
router.get("/recuperar", mostrarRecuperar);

export default router;
