/**
 * Aquí se define la estructura de los datos,
 * en su caso mapeo de datos a una base de datos.
 * 
 * Para el caso del formulario.
 *  1. Registrar usuario
 *  2. Recuperar usuario
 *  3. Modificar contraseña
 */

import { readFile, writeFile } from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "../data/users.json");

export const readUsers = async () => {
    try {
        const data = await readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

export const writeUser = async (newUser) => {
    try {
        const data  = await readFile(FILE_PATH, 'utf-8');
        const users = JSON.parse(data);

        users.push(newUser);

        await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
        return users;
    } catch (error) {
        console.error('Error registrando usuario:', error);
        return null;
    }
};

export const findUserByEmail = async (email) => {
    const users = await readUsers();
    return users.find(
        ({ correo: c }) =>
            c && email && c.toLowerCase() === email.toLowerCase()
    ) || null;
};

export const existsUser = async (email) =>
    !!(await findUserByEmail(email));

export const findUserByUsername = async (username) => {
    const users = await readUsers();
    return users.find(
        ({ Usuario: u }) =>
            u && username && u.toLowerCase() === username.toLowerCase()
    ) || null;
};

// ── Actualizar contraseña (busca por correo) ──────────────────────────────────
export const updatePassword = async (correo, nuevaContraseñaHash) => {
    try {
        const users = await readUsers();

        // ✅ Localiza al usuario por correo en vez de nombre
        const index = users.findIndex(
            ({ correo: c }) =>
                c && correo && c.toLowerCase() === correo.toLowerCase()
        );

        if (index === -1) return null;

        users[index].contraseña = nuevaContraseñaHash;

        await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
        return users[index];
    } catch (error) {
        console.error('Error actualizando contraseña:', error);
        return null;
    }
};
