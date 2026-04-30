import express from "express";
import { mostrarFormulario, registrarUsuario, mostrarLogin, loginUsuario, 
    mostrarRecuperar, mostrarDashboard, buscarUsuarioRecuperar, validarRespuestaRecuperar,
     cambiarContrasenaC, logout } from "../controllers/formControllers.js";

const router = express.Router();

// Login — raíz del sitio
router.get("/", mostrarLogin);
router.get("/login", mostrarLogin);
router.post("/login", loginUsuario);

// Registro
router.get("/registro", mostrarFormulario);
router.post("/registro", registrarUsuario);

// Dashboard
router.get("/dashboard", mostrarDashboard);

// Recuperar contraseña
router.get("/recuperar", mostrarRecuperar);
router.post("/recuperar/buscar",   buscarUsuarioRecuperar);
router.post("/recuperar/validar",  validarRespuestaRecuperar);
router.post("/recuperar/cambiar",  cambiarContrasenaC);


router.get("/logout", logout);

export default router;
