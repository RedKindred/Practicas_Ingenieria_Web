import path from "path";
import { fileURLToPath } from "url";
import { procesarFormulario, procesarLogin } from "../services/formService.js";
import { writeUser, existsUser, findUserByEmail } from "../models/usersModel.js";
import bcrypt from "bcrypt";
export const mostrarDashboard = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/dashboard.html"));
};

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Login
export const mostrarLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

export const loginUsuario = async (req, res) => {
    try {
        // 1. Valida formato
        await procesarLogin(req.body);

        // 2. Busca al usuario por correo en users.json
        const usuario = await findUserByEmail(req.body.correo);
        if (!usuario) {
            return res.status(401).json({ ok: false, mensaje: "Usuario no encontrado" });
        }

        // 3. Verifica que el nombre de usuario coincida
        if (usuario.Usuario !== req.body.Usuario) {
            return res.status(401).json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
        }

        // 4. Compara la contraseña con el hash guardado
        const passCorrecta = await bcrypt.compare(req.body.contraseña, usuario.contraseña);
        if (!passCorrecta) {
            return res.status(401).json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
        }

        // 5. Login exitoso — redirige al dashboard
        res.status(200).json({ ok: true, redirigir: "/dashboard" });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// Registro
export const mostrarFormulario = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const registrarUsuario = async (req, res) => {
    try {
        // 1. Valida y hashea los datos
        const resultado = await procesarFormulario(req.body);

        // 2. Verifica que el correo no esté registrado ya
        const yaExiste = await existsUser(resultado.correo);
        if (yaExiste) {
            return res.status(400).json({ ok: false, mensaje: "El correo ya está registrado" });
        }

        // 3. Guarda el usuario en users.json
        await writeUser(resultado);

        res.status(200).json({ ok: true, mensaje: "Usuario registrado correctamente" });

    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// Recuperar contraseña
export const mostrarRecuperar = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/recuperar.html"));
};
