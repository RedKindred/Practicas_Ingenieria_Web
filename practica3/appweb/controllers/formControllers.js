import path from "path";
import { fileURLToPath } from "url";
import { processForm, validateUser,buscarUsuario, validarRespuesta, cambiarContrasena } from "../services/formService.js";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Dashboard 
export const mostrarDashboard = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/dashboard.html"));
};

// ── Login 
export const mostrarLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

export const mostrarFormulario = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const mostrarRecuperar = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/recuperar.html"));
};



export const loginUsuario = async (req, res) => {
    try {
        const resultado = await validateUser(req.body);
        if (!resultado.success) {
            return res.status(401).json({ ok: false, mensaje: Object.values(resultado.errors)[0] });
        }
        res.status(200).json({ ok: true, redirigir: "/dashboard" });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};


export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await processForm(req.body);
        if (!resultado.success) {
            return res.status(400).json({ ok: false, mensaje: Object.values(resultado.errors)[0] });
        }
        res.status(200).json({ ok: true, mensaje: "¡Usuario registrado correctamente!" });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

export const buscarUsuarioRecuperar = async (req, res) => {
    try {
        const resultado = await buscarUsuario(req.body);
        if (!resultado.success) {
            return res.status(404).json({ ok: false, mensaje: Object.values(resultado.errors)[0] });
        }
        res.status(200).json({ ok: true, pregunta: resultado.pregunta });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

export const validarRespuestaRecuperar = async (req, res) => {
    try {
        const resultado = await validarRespuesta(req.body);
        if (!resultado.success) {
            return res.status(401).json({ ok: false, mensaje: Object.values(resultado.errors)[0] });
        }
        res.status(200).json({ ok: true, mensaje: "Respuesta correcta" });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

export const cambiarContrasenaC = async (req, res) => {
    try {
        const resultado = await cambiarContrasena(req.body);
        if (!resultado.success) {
            return res.status(400).json({ ok: false, mensaje: Object.values(resultado.errors)[0] });
        }
        res.status(200).json({ ok: true, mensaje: "¡Contraseña actualizada correctamente!" });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};