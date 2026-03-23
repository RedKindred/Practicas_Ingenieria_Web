import express from "express";
import { mostrarFormulario, registrarUsuario, mostrarLogin, loginUsuario } from "../controllers/formControllers.js";

const router = express.Router();

// Login — raíz del sitio
router.get("/", mostrarLogin);
router.get("/login", mostrarLogin);
router.post("/login", loginUsuario);

// Registro
router.get("/registro", mostrarFormulario);
router.post("/registro", registrarUsuario);

export default router;
