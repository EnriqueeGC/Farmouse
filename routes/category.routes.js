const express = require('express');
const categoryController = require('../controllers/category.controller.js');

const router = express.Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id_categoria', categoryController.getCategoryById);
router.put('/:id_categoria', categoryController.updateCategoryById);
router.delete('/:id_categoria', categoryController.deleteCategoryById);

module.exports = router;
