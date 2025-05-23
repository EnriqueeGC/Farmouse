const { Product } = require('../config/db.config.js');
const { storage } = require('../config/cloudinary.config.js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage });
const { Op, Sequelize } = require('sequelize');

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const precio = parseFloat(req.body.precio);
        const stock = parseInt(req.body.stock, 10);
        const id_subcategoria = parseInt(req.body.id_subcategoria, 10);
        let url_imagen = null;

        // Validar campos obligatorios
        if (
            !nombre ||
            !descripcion ||
            isNaN(precio) ||
            isNaN(stock) ||
            isNaN(id_subcategoria)
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios y deben ser válidos." });
        }

        // Subir imagen si fue enviada
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                url_imagen = result.secure_url;
            } catch (error) {
                console.error("Error uploading image to Cloudinary", error);
                return res.status(500).json({ message: "Error al subir imagen a Cloudinary" });
            }
        }

        // Crear producto en base de datos
        const newProduct = await Product.create({
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria,
            url_imagen,
        });

        res.status(201).json({
            message: "Producto creado exitosamente",
            data: newProduct,
        });
    } catch (error) {
        console.error("❌ Error creando producto:", error);
        res.status(500).json({ message: "Error creando producto", error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error('❌ Error retrieving products:', error);
        res.status(500).json({ message: "Error retrieving products", error: error.message });
    };
};

exports.getById = async (req, res) => {
    try {
        const { id_producto } = req.params;

        if (!id_producto) {
            return res.status(400).json({ message: "ID is required." });
        };

        const product = await Product.findByPk(id_producto);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error('❌ Error retrieving product:', error);
        res.status(500).json({ message: "Error retrieving product", error: error.message });
    };
};

exports.getProductByName = async (req, res) => {
    try {
        const { nombre } = req.params;

        if (!nombre) {
            return res.status(400).json({ message: "Name is required." });
        }

        const product = await Product.findAll({
            where: Sequelize.where(
                Sequelize.fn('UPPER', Sequelize.col('"NOMBRE"')),  // Oracle usa columnas en mayúsculas
                {
                    [Op.like]: `%${nombre.toUpperCase()}%`
                }
            )
        });

        if (!product || product.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            data: product
        });

    } catch (error) {
        console.error('❌ Error retrieving product:', error);
        res.status(500).json({ message: "Error retrieving product", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const precio = parseFloat(req.body.precio);
        const stock = parseInt(req.body.stock, 10);
        const id_subcategoria = parseInt(req.body.id_subcategoria, 10);
        let url_imagen = null;

        // Buscar producto existente
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Validar campos obligatorios
        if (
            !nombre ||
            !descripcion ||
            isNaN(precio) ||
            isNaN(stock) ||
            isNaN(id_subcategoria)
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios y deben ser válidos." });
        }

        // Subir nueva imagen si fue enviada
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                url_imagen = result.secure_url;
            } catch (error) {
                console.error("Error uploading image to Cloudinary", error);
                return res.status(500).json({ message: "Error al subir imagen a Cloudinary" });
            }
        }

        // Actualizar campos del producto
        await product.update({
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria,
            url_imagen: url_imagen || product.url_imagen,
        });

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            data: product,
        });
    } catch (error) {
        console.error("❌ Error actualizando producto:", error);
        res.status(500).json({ message: "Error actualizando producto", error: error.message });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const { id_producto } = req.params;

        if (!id_producto) {
            return res.status(400).json({ message: "ID is required." });
        };

        const product = await Product.findByPk(id_producto);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Eliminar producto con Sequelize
        await Product.destroy({
            where: { id_producto: id_producto }
        });

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    };
};

exports.getProductBySubCategory = async (req, res) => {
    try {
        const { id_subcategoria } = req.params;

        if (!id_subcategoria) {
            return res.status(400).json({ message: "ID is required." });
        };

        const products = await Product.findAll({
            where: { id_subcategoria: id_subcategoria }
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "Products not found." });
        }

        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error('❌ Error retrieving products:', error);
        res.status(500).json({ message: "Error retrieving products", error: error.message });
    };
}