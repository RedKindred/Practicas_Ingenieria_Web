const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (CSS, JS del cliente, Imágenes)
// Esto asume que tienes una carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para el Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Rutas para las otras páginas
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'registro.html'));
});

app.get('/recuperar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'recuperar.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const fs = require('fs'); // Módulo para manejar archivos

// Middleware necesario para leer el cuerpo de las peticiones POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para recibir los datos del registro y guardarlos
app.post('/api/registrar', (req, res) => {
    const nuevoUsuario = req.body;
    const rutaArchivo = path.join(__dirname, 'usuarios.json');

    // 1. Leer el archivo actual (o crear uno vacío si no existe)
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let usuarios = [];
        if (!err && data) {
            usuarios = JSON.parse(data);
        }

        // 2. Agregar el nuevo usuario
        usuarios.push(nuevoUsuario);

        // 3. Guardar de nuevo en el archivo
        fs.writeFile(rutaArchivo, JSON.stringify(usuarios, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: "Error al guardar" });
            }
            // Devolvemos la lista actualizada para mostrarla "en tiempo real"
            res.send(usuarios);
        });
    });
});