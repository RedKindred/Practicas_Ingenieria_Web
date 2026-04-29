
import { getAllUsers, createUser, getByEmail, updateUserPassword } from '../models/usersSQLServer.js';
import { validateUser } from '../models/validator.js';


export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    validateUser(req.body);

    const id = await createUser(req.body);

    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// http://localhost:5000/api/sqlserver/users/pedro@gmail.com
export const findByEmail = async (req, res) => {
  try {
    console.log (req.params.correo)
    const users = await getByEmail(req.params.correo);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
   console.log('PUT recibido:');
    try {
        const { correo } = req.params;
        const { contrasena } = req.body;
        await updateUserPassword(correo, contrasena);
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};