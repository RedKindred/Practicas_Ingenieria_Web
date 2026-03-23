import path from "path";
import { fileURLToPath } from "url";
import { procesarFormulario, procesarLogin } from "../services/formService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Registro
export const mostrarFormulario = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await procesarFormulario(req.body);
        res.status(200).json({ ok: true, data: resultado });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// Login
export const mostrarLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

export const loginUsuario = async (req, res) => {
    try {
        const resultado = await procesarLogin(req.body);
        res.status(200).json({ ok: true, data: resultado });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};
