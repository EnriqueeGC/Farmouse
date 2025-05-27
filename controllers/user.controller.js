require('dotenv').config();
const { User } = require('../config/db.config.js');
const bcrypt = require('bcrypt');
const { storage } = require('../config/cloudinary.config.js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage })

const SECRET_KEY = process.env.SECRET_KEY;

exports.createUser = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            correo,
            direccion,
            telefono,
            nombre_usuario,
            contrasenia,
            rol
        } = req.body;

        if (!nombre || !apellido || !correo || !direccion || !telefono || !nombre_usuario || !contrasenia) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const finalRol = rol || "cliente";
        let url_imagen = null;

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                url_imagen = result.secure_url;
            } catch (error) {
                console.error("❌ Error subiendo imagen:", error);
                return res.status(500).json({ message: "Error al subir imagen" });
            }
        }

        const existingUser = await User.findOne({ where: { nombre_usuario } });
        if (existingUser) {
            return res.status(400).json({ message: "El nombre de usuario ya existe." });
        }

        const existingEmail = await User.findOne({ where: { correo } });
        if (existingEmail) {
            return res.status(400).json({ message: "El correo ya está en uso." });
        }

        // 👉 Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);

        const newUser = await User.create({
            nombre,
            apellido,
            correo,
            direccion,
            telefono,
            nombre_usuario,
            contrasenia: hashedPassword,
            rol: finalRol,
            url_imagen
        });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            data: {
                id_usuario: newUser.id_usuario,
                nombre_usuario: newUser.nombre_usuario,
                correo: newUser.correo
            }
        });

    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
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
        const { nombre, apellido, correo, direccion, telefono, nombre_usuario, contrasenia, rol } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ message: "El ID del usuario es obligatorio." });
        }

        const user = await User.findByPk(id_usuario);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if (correo && correo !== user.correo) {
            const emailExists = await User.findOne({ where: { correo } });
            if (emailExists) {
                return res.status(400).json({ message: "El correo ya está registrado por otro usuario." });
            }
        }

        if (nombre_usuario && nombre_usuario !== user.nombre_usuario) {
            const usernameExists = await User.findOne({ where: { nombre_usuario } });
            if (usernameExists) {
                return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
            }
        }

        let url_imagen = user.url_imagen;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                url_imagen = result.secure_url;
            } catch (error) {
                console.error("❌ Error subiendo imagen a Cloudinary:", error);
                return res.status(500).json({ message: "Error al subir la imagen" });
            }
        }

        let hashedPassword = user.contrasenia;
        if (contrasenia && contrasenia.trim() !== "") {
            hashedPassword = await bcrypt.hash(contrasenia, 10);
        }

        await user.update({
            nombre: nombre || user.nombre,
            apellido: apellido || user.apellido,
            correo: correo || user.correo,
            direccion: direccion || user.direccion,
            telefono: telefono || user.telefono,
            nombre_usuario: nombre_usuario || user.nombre_usuario,
            contrasenia: hashedPassword,
            rol: rol || user.rol,
            url_imagen
        });

        res.status(200).json({
            message: "Usuario actualizado exitosamente",
            data: user,
        });
    } catch (error) {
        console.error("❌ Error actualizando usuario:", error);
        res.status(500).json({ message: "Error actualizando usuario", error: error.message });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID is required." });
        };

        const user = await User.findByPk(id_usuario);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

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