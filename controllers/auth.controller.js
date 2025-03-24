require('dotenv').config();
const db = require('../config/db.config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

const login = async (req, res) => {
    const { nombre_usuario, contrasenia } = req.body;

    try {
        const query = `SELECT * FROM USUARIOS WHERE NOMBRE_USUARIO = :nombre_usuario`;
        const params = [nombre_usuario];

        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        const user = result.rows[0];

        const isValidPassword = await bcrypt.compare(contrasenia, user.CONTRASENIA);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            });
        };

        const token = jwt.sign(
            {
                id_usuario: user.ID_USUARIO,
                nombre_usuario: user.NOMBRE_USUARIO,
                rol: user.ROL
            },

            SECRET_KEY,
            {
                expiresIn: '1h'
            }
        );

        return res.status(200).json({
            message: 'Login exitoso',
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al hacer iniciar sesion',
            error
        });
    };
};

module.exports = { login };