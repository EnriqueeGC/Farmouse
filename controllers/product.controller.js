const { Product } = require('../config/db.config.js');
const { storage } = require('../config/cloudinary.config.js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage });
const { Op, Sequelize } = require('sequelize');

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, id_subcategoria } = req.body;

        if (!nombre || !descripcion || !precio || !stock || !id_subcategoria) {
            return res.status(400).json({ message: "All fields are required." });
        }

        let url_imagen = null;

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                url_imagen = result.secure_url;
            } catch (error) {
                console.error("❌ Error uploading image to Cloudinary:", error);
                return res.status(500).json({ message: "Error uploading image" });
            }
        }

        const newProduct = await Product.create({
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria,
            url_imagen
        });

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.error('❌ Error creating product:', error);
        res.status(500).json({ message: "Error creating product", error: error.message });
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

  exports.updateProductById = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const { nombre, descripcion, precio, stock, id_subcategoria } = req.body;

        if (!id_producto) {
            return res.status(400).json({ message: "ID is required." });
        }

        const product = await Product.findByPk(id_producto);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let url_imagen = product.url_imagen;

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                url_imagen = result.secure_url;
            } catch (error) {
                console.error("❌ Error uploading image to Cloudinary:", error);
                return res.status(500).json({ message: "Error uploading image" });
            }
        }

        await product.update({
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria,
            url_imagen
        });

        res.status(200).json({
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        console.error('❌ Error updating product:', error);
        res.status(500).json({ message: "Error updating product", error: error.message });
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