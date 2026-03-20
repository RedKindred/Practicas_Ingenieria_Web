export const procesarFormulario = async (datos) => {
    //Extraer los campos del objeto datos
    const { Usuario, correo, contraseña, respuesta } = datos;
    const errores = {};

    // Validación de Usuario 
    if (!Usuario || !/^[a-zA-Z]{3,20}$/.test(Usuario)) {
        errores.Usuario = "El usuario debe tener entre 3 y 20 letras";
    }

    // Validación de Correo
    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo electrónico inválido";
    }

    // Validación de Contraseña (Mayúscula, minúscula, número, min 8)
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!contraseña || !passRegex.test(contraseña)) {
        errores.contraseña = "La contraseña no cumple con los requisitos de seguridad";
    }

    // Validación de Respuesta de Seguridad (letras y espacios, 2-30)
    if (!respuesta || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(respuesta)) {
        errores.respuesta = "La respuesta es inválida o demasiado corta";
    }

    // si hay errores, lanzamos la excepción
    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    //Preparar objeto final para "enviar" o guardar
    const datosProcesados = {
        Usuario,
        correo,
        // Normalmente la contraseña se cifraría aquí antes de enviarla
        respuesta,
        fecha: new Date()
    };

    console.log("Datos listos para el servidor:", datosProcesados);
    return datosProcesados;
};