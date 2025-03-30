const express = require("express");
const subCategoryController = require("../controllers/subCategory.controller.js");

const router = express.Router();

router.post('/', subCategoryController.createSubCategory);
router.get('/', subCategoryController.getAllSubCategories);
router.get('/:id', subCategoryController.getById);
router.put('/:id', subCategoryController.updateSubCategoryById);
router.delete('/:id', subCategoryController.deleteSubCategoryById);

module.exports = router;