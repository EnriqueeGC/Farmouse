const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });

const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/', upload.single('url_imagen'), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id_usuario', userController.getById);
router.get('/getByName/:nombre_usuario', userController.getByUsername);
router.get('/getByEmail/:correo', userController.getByEmail);
router.put('/:id', upload.single('url_imagen'), userController.updateUserById);
router.delete('/:id_usuario', userController.deleteUserById);

module.exports = router;
