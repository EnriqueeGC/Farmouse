const { v4: uuidv4 } = require('uuid');
const { Category } = require('../config/db.config.js'); // 🔥 Importamos correctamente

exports.createCategory = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre || nombre.trim().length < 3) {
            return res.status(400).json({ message: "El nombre es requerido y debe tener al menos 3 caracteres." });
        }

        // Crear categoría con Sequelize
        const newCategory = await Category.create({ nombre });

        res.status(201).json({
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        console.error('❌ Error creating category:', error);
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({
            message: "Categories retrieved successfully",
            data: categories
        });
    } catch (error) {
        console.error('❌ Error retrieving categories:', error);
        res.status(500).json({ message: "Error retrieving categories", error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        };

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        res.status(200).json({
            message: "Category retrieved successfully",
            data: category
        });
    } catch (error) {
        console.error('❌ Error retrieving category:', error);
        res.status(500).json({ message: "Error retrieving category", error: error.message });
    };
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        };

        if (!nombre || nombre.trim().length < 3) {
            return res.status(400).json({ message: "El nombre es requerido y debe tener al menos 3 caracteres." });
        };

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        };

        category.nombre = nombre;
        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        console.error('❌ Error updating category:', error);
        res.status(500).json({ message: "Error updating category", error: error.message });
    };
};

exports.deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        }

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        await category.destroy();

        res.status(200).json({
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        console.error('❌ Error deleting category:', error);
        res.status(500).json({ message: "Error deleting category", error: error.message });
    };
};