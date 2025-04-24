const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id_usuario', userController.getById);
router.get('/username/:nombre_usuario', userController.getByUsername);
router.put('/:id_usuario', userController.updateUserById);
router.delete('/:id_usuario', userController.deleteUserById);

module.exports = router;