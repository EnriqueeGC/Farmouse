const express = require('express');
const categoryController = require('../controllers/category.controller.js');

const router = express.Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategoryById);

module.exports = router;
