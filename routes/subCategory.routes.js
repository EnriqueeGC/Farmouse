const express = require("express");
const subCategoryController = require("../controllers/subCategory.controller.js");

const router = express.Router();

router.post('/', subCategoryController.createSubcategory);
router.get('/', subCategoryController.getAllSubcategories);
router.get('/:id_subcategoria', subCategoryController.getSubcategoryById);
router.put('/:id_subcategoria', subCategoryController.updateSubcategoryById);
router.delete('/:id_subcategoria', subCategoryController.deleteSubcategoryById);

module.exports = router;