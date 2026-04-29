import bcrypt from "bcrypt";

// ── Registro
export const processForm = async (datos) => {
    const { Usuario, correo, contraseña, pregunta, respuesta } = datos;
    const errores = {};

    // Validaciones
    if (!Usuario || !/^[a-zA-Z]{3,20}$/.test(Usuario)) {
        errores.Usuario = "El usuario debe tener entre 3 y 20 letras";
    }
    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }
    if (!contraseña || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(contraseña)) {
        errores.contraseña = "Mínimo 8 caracteres: mayúscula, minúscula y número";
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

    // Hashea
    const salt           = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);
    const respuestaHash  = await bcrypt.hash(respuesta.trim(), salt);

    // Verifica si el correo ya existe en SQL Server
    const respBuscar = await fetch(`http://localhost:5000/api/sqlserver/users/${correo}`);
    const existe     = await respBuscar.json();
    if (existe && existe.length > 0) {
        return { success: false, errors: { correo: "El correo ya está registrado" } };
    }

    // Guarda en SQL Server
    await fetch(`http://localhost:5000/api/sqlserver/users`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
            nombre:      Usuario,       // Usuario  → nombre
            correo:      correo,
            contrasena:  contraseñaHash, // contraseña → contrasena
            preguntarc:  pregunta,       // pregunta → preguntarc
            respuestarc: respuestaHash   // respuesta → respuestarc
        })
    });

    return { success: true };
};


// ── Login
export const validateUser = async (datos) => {
    const { Usuario, correo, contraseña } = datos;
    const errores = {}; // ← faltaba esta línea

    if (!Usuario || !/^[a-zA-Z]{3,20}$/.test(Usuario)) {
        errores.Usuario = "El usuario debe tener entre 3 y 20 letras";
    }
    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }
    if (!contraseña || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(contraseña)) {
        errores.contraseña = "La contraseña no cumple con los requisitos";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const resp     = await fetch(`http://localhost:5000/api/sqlserver/users/${correo}`);
    const usuarios = await resp.json();
    const user     = usuarios[0];

    if (!user) {
        return { success: false, errors: { correo: "Usuario no encontrado" } };
    }

    if (user.nombre !== Usuario) {
        return { success: false, errors: { Usuario: "Usuario o contraseña incorrectos" } };
    }

    const match = await bcrypt.compare(contraseña, user.contrasena);
    if (!match) {
        return { success: false, errors: { contraseña: "Usuario o contraseña incorrectos" } };
    }

    return { success: true, data: user };
};

export const buscarUsuario = async (datos) => {
    const { correo } = datos;
    const errores = {};

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const resp     = await fetch(`http://localhost:5000/api/sqlserver/users/${correo}`);
    const usuarios = await resp.json();
    const user     = usuarios[0];

    if (!user) {
        return { success: false, errors: { correo: "Usuario no encontrado" } };
    }

    return { success: true, pregunta: user.preguntarc };
};



// ── Recuperar: validar respuesta de seguridad
export const validarRespuesta = async (datos) => {
    const { correo, respuesta } = datos;
    const errores = {};

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }
    if (!respuesta || respuesta.trim().length < 2) {
        errores.respuesta = "La respuesta es obligatoria";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const resp     = await fetch(`http://localhost:5000/api/sqlserver/users/${correo}`);
    const usuarios = await resp.json();
    const user     = usuarios[0];

    if (!user) {
        return { success: false, errors: { correo: "Usuario no encontrado" } };
    }

    const match = await bcrypt.compare(respuesta.trim(), user.respuestarc);
    if (!match) {
        return { success: false, errors: { respuesta: "Respuesta incorrecta" } };
    }

    return { success: true };
};


// ── Recuperar: cambiar contraseña
export const cambiarContrasena = async (datos) => {
    const { correo, nuevaContrasena } = datos;
    const errores = {};

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }
    if (!nuevaContrasena || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(nuevaContrasena)) {
        errores.nuevaContrasena = "La contraseña no cumple con los requisitos";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const salt           = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(nuevaContrasena, salt);

    await fetch(`http://localhost:5000/api/sqlserver/users/${correo}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ contrasena: contraseñaHash })
    });

    return { success: true };
};