const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (CSS, JS del cliente, Imágenes)
// Esto asume que tienes una carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para el Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
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