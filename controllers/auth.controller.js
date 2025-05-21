require('dotenv').config();
const { User } = require('../config/db.config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
    try {
        const { nombre_usuario, contrasenia } = req.body;

        if (!nombre_usuario || !contrasenia) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Buscar el usuario por nombre de usuario
        const user = await User.findOne({ where: { nombre_usuario } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isPasswordValid = await bcrypt.compare(contrasenia, user.contrasenia);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Generar un token JWT
        const token = jwt.sign({ id_usuario: user.id_usuario }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            data: {
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre_usuario,
                url_imagen: user.url_imagen,
                rol: user.rol,
                token
            }
        });
    } catch (error) {
        console.error('❌ Error during login:', error);
        res.status(500).json({ message: "Error during login", error: error.message });
    }
}