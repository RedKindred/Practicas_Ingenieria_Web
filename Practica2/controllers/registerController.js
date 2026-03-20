exports.registrarUsuario = (req, res) => {
    //Extraer los nombres exactos definidos en el atributo 
    const { Usuario, correo, contraseña, respuesta } = req.body;

    //Validaciones básicas de presencia
    if (!Usuario || !correo || !contraseña || !respuesta) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios (Usuario, correo, contraseña y respuesta)."
        });
    }

    // Simulación de guardado (Objeto final)
    const usuario = {
        Usuario,
        correo,
        // Nota: En un entorno real, aquí deberías usar bcrypt para hashear la contraseña
        respuesta, 
    };

    console.log("Datos recibidos", usuario);

    // Respuesta de éxito
    res.status(200).json({
        mensaje: "Usuario registrado correctamente",
        data: usuario
    });
};