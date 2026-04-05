import bcrypt from "bcrypt";

// ── Registro ──────────────────────────────────────────────────────────────────
export const procesarFormulario = async (datos) => {
    const { Usuario, correo, contraseña, pregunta, respuesta } = datos;
    const errores = {};

    if (!Usuario || !/^[a-zA-Z]{3,20}$/.test(Usuario)) {
        errores.Usuario = "El usuario debe tener entre 3 y 20 letras";
    }

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }

    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!contraseña || !passRegex.test(contraseña)) {
        errores.contraseña = "La contraseña no cumple con los requisitos de seguridad";
    }

    if (!pregunta) {
        errores.pregunta = "Selecciona una pregunta de seguridad";
    }

    if (!respuesta || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(respuesta)) {
        errores.respuesta = "La respuesta es inválida o demasiado corta";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const salt           = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);
    const respuestaHash  = await bcrypt.hash(respuesta.trim(), salt);

    const datosProcesados = {
        Usuario,
        correo,
        contraseña: contraseñaHash,
        pregunta,
        respuesta: respuestaHash
    };

    console.log("Usuario registrado en JSON:", JSON.stringify(datosProcesados, null, 2));

    return datosProcesados;
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const procesarLogin = async (datos) => {
    const { Usuario, correo, contraseña } = datos;
    const errores = {};

    if (!Usuario || !/^[a-zA-Z]{3,20}$/.test(Usuario)) {
        errores.Usuario = "El usuario debe tener entre 3 y 20 letras";
    }

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }

    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!contraseña || !passRegex.test(contraseña)) {
        errores.contraseña = "La contraseña no cumple con los requisitos de seguridad";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }
};

// ── Recuperar: validar respuesta ──────────────────────────────────────────────
export const procesarRecuperar = async (datos) => {
    const { correo, respuesta } = datos; // ✅ correo en vez de usuario

    const errores = {};

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) { // ✅ validación de correo
        errores.correo = "Correo electrónico inválido";
    }

    if (!respuesta || respuesta.trim().length < 2) {
        errores.respuesta = "La respuesta es obligatoria";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    return { correo, respuesta: respuesta.trim() };
};

// ── Recuperar: cambiar contraseña ─────────────────────────────────────────────
export const procesarCambiarContrasena = async (datos) => {
    const { correo, nuevaContrasena } = datos;
    const errores = {};

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }

    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!nuevaContrasena || !passRegex.test(nuevaContrasena)) {
        errores.nuevaContrasena = "La contraseña no cumple con los requisitos de seguridad";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const salt           = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(nuevaContrasena, salt);

    return { correo, contraseñaHash };
};
