/* 
   Archivo principal que inicia el servidor.
   Responsabilidades:
     1. Configurar Express
     2. Leer variables de entorno
     3. Registrar middlewares
     4. Registrar rutas
     5. Servir archivos estáticos (assets)


  Se requiere configurar el proyecto nodeJS
  
  1. Iniciarlizar proyecto
     npm init -y ------ asigna valores por defecto en 
                 ------ la configuración de package.json

   2. Instalar dependencias para el proyecto: en este caso
      Express para el servidor HTTP para procesar peticiones
      a través de envíos POST y GET.

      npm install express-session
      npm install ejs
      npm install --save-dev nodemon

*/

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";         // npm install dotenv
import session from "express-session"; // npm install express-session
import formRoutes from "./routes/formRoutes.js";

dotenv.config(); // ← SIEMPRE lo primero

const PORT = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 1. Motor de vistas EJS — antes de rutas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Sesiones — antes de rutas
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 minutos
}));

// 4. Archivos estáticos
app.use("/", express.static(path.join(__dirname, "public")));

// 5. Rutas — siempre al final
app.use("/", formRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
