import express from "express";
import { mostrarFormulario, registrarUsuario, mostrarLogin, loginUsuario } from "../controllers/formControllers.js";

const router = express.Router();

router.get("/", mostrarFormulario);
router.post('/registro',registrarUsuario);
router.get('/registro',registrarUsuario);

export default router;
