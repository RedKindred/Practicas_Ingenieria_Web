import path from "path";
import { fileURLToPath } from "url";
import { writeUser, existsUser, findUserByEmail, findUserByUsername, updatePassword } from "../models/usersModel.js";
import { procesarFormulario, procesarLogin, procesarRecuperar, procesarCambiarContrasena } from "../services/formService.js";
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

export const loginUsuario = async (req, res) => {
    try {
        await procesarLogin(req.body);

        const usuario = await findUserByEmail(req.body.correo);
        if (!usuario) {
            return res.status(401).json({ ok: false, mensaje: "Usuario no encontrado" });
        }

        if (usuario.Usuario !== req.body.Usuario) {
            return res.status(401).json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
        }

        const passCorrecta = await bcrypt.compare(req.body.contraseña, usuario.contraseña);
        if (!passCorrecta) {
            return res.status(401).json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
        }

        res.status(200).json({ ok: true, redirigir: "/dashboard" });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// ── Registro 
export const mostrarFormulario = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await procesarFormulario(req.body);

        const yaExiste = await existsUser(resultado.correo);
        if (yaExiste) {
            return res.status(400).json({ ok: false, mensaje: "El correo ya está registrado" });
        }

        await writeUser(resultado);

        res.status(200).json({ ok: true, mensaje: "¡Usuario registrado correctamente!" });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// ── Recuperar contraseña 
export const mostrarRecuperar = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/recuperar.html"));
};

// busca el usuario y devuelve su pregunta de seguridad
export const buscarUsuarioRecuperar = async (req, res) => {
    try {
        const { correo } = req.body;
        const user = await findUserByEmail(correo);

        if (!user) {
            return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
        }

        res.status(200).json({ ok: true, pregunta: user.pregunta });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// Paso 2 — valida la respuesta de seguridad
export const validarRespuestaRecuperar = async (req, res) => {
    try {
        const datos = await procesarRecuperar(req.body);
        const user  = await findUserByEmail(datos.correo);

        if (!user) {
            return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
        }

        const respuestaCorrecta = await bcrypt.compare(datos.respuesta, user.respuesta);
        if (!respuestaCorrecta) {
            return res.status(401).json({ ok: false, mensaje: "Respuesta incorrecta" });
        }

        res.status(200).json({ ok: true, mensaje: "Respuesta correcta ✅" });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// Paso 3 — cambia la contraseña
export const cambiarContrasena = async (req, res) => {
    try {
       const { correo, contraseñaHash } = await procesarCambiarContrasena(req.body);
        const actualizado = await updatePassword(correo, contraseñaHash);
        if (!actualizado) {
            return res.status(404).json({ ok: false, mensaje: "No se pudo actualizar la contraseña" });
        }

        res.status(200).json({ ok: true, mensaje: "¡Contraseña actualizada correctamente!" });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};
