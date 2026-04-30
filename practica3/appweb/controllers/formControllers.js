import path from "path";
import { fileURLToPath } from "url";
import { processForm, validateUser, buscarUsuario, validarRespuesta, cambiarContrasena } from "../services/formService.js";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Dashboard
export const mostrarDashboard = async (req, res) => {
    // ✏️ AGREGA: verificar sesión activa antes de mostrar el dashboard
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    // ✏️ AGREGA: pasar el nombre del usuario a la vista EJS
    res.render("dashboard", { nombre: req.session.usuario.nombre });
};

// ── Login — SIN CAMBIOS
export const mostrarLogin = async (req, res) => {
    res.render("login");
};

// ── Registro — SIN CAMBIOS
export const mostrarFormulario = async (req, res) => {
    res.render("registro");
};

// ── Recuperar — SIN CAMBIOS
export const mostrarRecuperar = async (req, res) => {
    res.render("recuperar");
};

// ── Login
export const loginUsuario = async (req, res) => {
    try {
        const resultado = await validateUser(req.body);
        if (!resultado.success) {
            return res.status(401).json({ ok: false, mensaje: Object.values(resultado.errors)[0] });
        }
        // ✏️ AGREGA: guardar datos del usuario en la sesión
        req.session.usuario = {
            nombre: resultado.data.nombre,
            correo: resultado.data.correo
        };
        res.status(200).json({ ok: true, redirigir: "/dashboard" });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// ── Registro — SIN CAMBIOS
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

// ── Buscar usuario (recuperar paso 1) — SIN CAMBIOS
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

// ── Validar respuesta (recuperar paso 2) — SIN CAMBIOS
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

// ── Cambiar contraseña (recuperar paso 3) — SIN CAMBIOS
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

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};