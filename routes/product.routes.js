const express = require('express');
const productController = require('../controllers/product.controller.js');

const router = express.Router();

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id_producto', productController.getById);
router.get('/nombre/:nombre', productController.getProductByName);
router.get('/subcategoria/:id_subcategoria', productController.getProductBySubCategory);
router.put('/:id_producto', productController.updateProductById);
router.delete('/:id_producto', productController.deleteProductById);

module.exports = router;