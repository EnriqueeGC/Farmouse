const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id_usuario', userController.getById);
router.get('/getByName/:nombre_usuario', userController.getByUsername);
router.get('/getByEmail/:email', userController.getByEmail);
router.put('/:id_usuario', userController.updateUserById);
router.delete('/:id_usuario', userController.deleteUserById);

module.exports = router;