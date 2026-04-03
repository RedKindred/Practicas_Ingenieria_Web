import express from "express";
import { mostrarFormulario, registrarUsuario, mostrarLogin, loginUsuario, mostrarRecuperar } from "../controllers/formControllers.js";

const router = express.Router();

// Login — raíz del sitio
router.get("/", mostrarLogin);
router.get("/login", mostrarLogin);
router.post("/login", loginUsuario);

// Registro
router.get("/registro", mostrarFormulario);
router.post("/registro", registrarUsuario);

// Recuperar contraseña
router.get("/recuperar", mostrarRecuperar);

export default router;
