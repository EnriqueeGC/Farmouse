const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', userController.registerUser);
router.get('/all', userController.getAllUsers);
router.get('/get/:id_usuario', userController.getUserById);
router.put('/update/:id_usuario', userController.updateUserById);
router.delete('/delete/:id_usuario', userController.deleteUserById);

module.exports = router;