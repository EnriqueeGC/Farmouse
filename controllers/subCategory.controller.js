const { SubCategory } = require('../config/db.config.js');
const { Category } = require('../config/db.config.js');

exports.createSubCategory = async (req, res) => {
    try {
        const { nombre, id_categoria } = req.body;

        if (!nombre || !id_categoria) {
            return res.status(400).json({ message: "Name and category ID are required." });
        }

        // Crear subcategoría con Sequelize
        const newSubCategory = await SubCategory.create({ nombre, id_categoria });

        res.status(201).json({
            message: "Subcategory created successfully",
            data: newSubCategory
        });
    } catch (error) {
        console.error('❌ Error creating subcategory:', error);
        res.status(500).json({ message: "Error creating subcategory", error: error.message });
    };
};

exports.getAllSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.findAll();
        res.status(200).json({
            message: "Subcategories retrieved successfully",
            data: subcategories
        });
    } catch (error) {
        console.error('❌ Error retrieving subcategories:', error);
        res.status(500).json({ message: "Error retrieving subcategories", error: error.message });
    };
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        };

        const subcategory = await SubCategory.findByPk(id);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found." });
        }

        res.status(200).json({
            message: "Subcategory retrieved successfully",
            data: subcategory
        });
    } catch (error) {
        console.error('❌ Error retrieving subcategory:', error);
        res.status(500).json({ message: "Error retrieving subcategory", error: error.message });
    };
};

exports.getByCategoryId = async (req, res) => {
    try {
        const { id_categoria } = req.params;

        if (!id_categoria) {
            return res.status(400).json({ message: "Category ID is required." });
        }

        const subcategories = await SubCategory.findAll({ 
            where: { id_categoria },
            attributes: ['id_subcategoria', 'nombre'] // Asegúrate de incluir solo los campos necesarios
        });

        if (subcategories.length === 0) {
            return res.status(404).json({ message: "No subcategories found for this category." });
        }

        const nameCategory = await Category.findByPk(id_categoria);
        if (!nameCategory) {
            return res.status(404).json({ message: "Category not found." });
        }

        const categoryName = nameCategory.nombre;

        // Mapear y agregar nombre de la categoría a cada subcategoría
        const formattedSubcategories = subcategories.map(subcat => ({
            id_subcategoria: subcat.id_subcategoria,
            nombre: subcat.nombre,
            categoryName: categoryName
        }));

        res.status(200).json({
            message: "Subcategories retrieved successfully",
            data: formattedSubcategories
        });
    } catch (error) {
        console.error('❌ Error retrieving subcategories by category ID:', error);
        res.status(500).json({ message: "Error retrieving subcategories", error: error.message });
    }
};


exports.updateSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_categoria } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        };

        // Actualizar subcategoría con Sequelize
        const updatedSubCategory = await SubCategory.update(
            { nombre, id_categoria },
            { where: { id } }
        );

        if (updatedSubCategory[0] === 0) {
            return res.status(404).json({ message: "Subcategory not found." });
        }

        res.status(200).json({
            message: "Subcategory updated successfully",
            data: { id, nombre, id_categoria }
        });
    } catch (error) {
        console.error('❌ Error updating subcategory:', error);
        res.status(500).json({ message: "Error updating subcategory", error: error.message });
    };
};

exports.deleteSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        };

        // Eliminar subcategoría con Sequelize
        const deletedSubCategory = await SubCategory.destroy({ where: { id } });

        if (deletedSubCategory === 0) {
            return res.status(404).json({ message: "Subcategory not found." });
        }

        res.status(200).json({
            message: "Subcategory deleted successfully"
        });
    } catch (error) {
        console.error('❌ Error deleting subcategory:', error);
        res.status(500).json({ message: "Error deleting subcategory", error: error.message });
    };
};