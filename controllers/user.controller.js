require('dotenv').config();
const db = require('../config/db.config.js');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = async (req, res) => {
    const { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia} = req.body;
    const rol = 3;

    try {
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const query = `INSERT INTO USUARIOS 
            (NOMBRE, APELLIDO, CORREO, DIRECCION, TELEFONO, NOMBRE_USUARIO, CONTRASENIA, ROL) 
            VALUES (:nombre, :apellido, :correo, :direccion, :telefono, :nombre_usuario, :contrasenia, :rol)`;
            const params = { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia: hashedPassword, rol};
            const result = await db.executeQuery(query, params);

            res.status(201).json({
                message: 'Usuario registrado correctamente',
                result
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al registrar el usuario',
            error
        });
    };
};

const getAllUsers = async (req, res) => {   
    try {
        const query = `SELECT * FROM USUARIOS WHERE ROL = 3`;
        const result = await db.executeQuery(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener los usuarios',
            error
        });
    };
};

const getUserById = async (req, res) => {   
    const { id_usuario } = req.params;

    try {
        const query = `SELECT * FROM USUARIOS WHERE ID_USUARIO = :id_usuario`;
        const params = [id_usuario];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        };

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener el usuario',
            error
        });
    };
};

const updateUserById = async (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const query = `UPDATE USUARIOS SET NOMBRE = :nombre, APELLIDO = :apellido, CORREO = :correo, DIRECCION = :direccion, TELEFONO = :telefono, NOMBRE_USUARIO = :nombre_usuario, CONTRASENIA = :contrasenia WHERE ID_USUARIO = :id_usuario`;
        const params = { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia: hashedPassword, id_usuario };
        const result = await db.executeQuery(query, params);

        res.status(200).json({
            message: 'Usuario actualizado correctamente',
            result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar el usuario',
            error
        });
    };
};

const deleteUserById = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const query = `DELETE FROM USUARIOS WHERE ID_USUARIO = :id_usuario`;
        const params = [id_usuario];

        const result = await db.executeQuery(query, params);
        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        };

        res.status(200).json({
            message: 'Usuario eliminado correctamente',
            result
        })
    } catch (error) {
       console.error(error);
         res.status(500).json({
              message: 'Error al eliminar el usuario',
              error
         }); 
    };
};

module.exports = {
    registerUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};