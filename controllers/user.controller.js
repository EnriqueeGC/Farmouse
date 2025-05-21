require('dotenv').config();
const { User } = require('../config/db.config.js');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

exports.createUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia, url_imagen } = req.body;
        const rol = "cliente"; // Default role for new users

        if (!nombre || !apellido || !correo || !direccion || !telefono || !nombre_usuario || !contrasenia || !rol || !url_imagen) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Verificar si el nombre de usuario ya existe
        const existingUser = await User.findOne({ where: { nombre_usuario } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }
        // Verificar si el correo ya existe
        const existingEmail = await User.findOne({ where: { correo } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists." });
        }
        // Encriptar la contraseña
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(contrasenia, salt);

        console.log('🔑 Password hashed:', hashedPassword);
        // Crear usuario con Sequelize
        const newUser = await User.create({
            nombre,
            apellido,
            correo,
            direccion,
            telefono,
            nombre_usuario,
            contrasenia: hashedPassword,
            rol,
            url_imagen
        });

        res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    };
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        console.error('❌ Error retrieving users:', error);
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    };
};

exports.getById = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID is required." });
        };

        const user = await User.findByPk(id_usuario);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error('❌ Error retrieving user:', error);
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    };
};

exports.getByUsername = async (req, res) => {
    try {
        const { nombre_usuario } = req.params;

        if (!nombre_usuario) {
            return res.status(400).json({ message: "Username is required." });
        };

        const user = await User.findOne({ where: { nombre_usuario } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error('❌ Error retrieving user:', error);
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    };
};

exports.getByEmail = async (req, res) => {
    try {
        const { correo } = req.params;

        if (!correo) {
            return res.status(400).json({ message: "Email is required." });
        };

        const user = await User.findOne({ where: { correo } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error('❌ Error retrieving user:', error);
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    };
};

exports.updateUserById = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia, url_imagen } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID is required." });
        };

        // Buscar usuario por ID
        const user = await User.findByPk(id_usuario);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // contrasenia
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Actualizar usuario con Sequelize
        await user.update({
            nombre,
            apellido,
            correo,
            direccion,
            telefono,
            nombre_usuario,
            contrasenia: hashedPassword,
            url_imagen
        });

        res.status(200).json({
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    };
};

exports.deleteUserById = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID is required." });
        };

        // Buscar usuario por ID
        const user = await User.findByPk(id_usuario);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Eliminar usuario con Sequelize
        await user.destroy();

        res.status(200).json({
            message: "User deleted successfully",
            data: user
        });
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    };
};