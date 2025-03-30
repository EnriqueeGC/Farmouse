const db = require('../config/db.config.js');

const createSubcategory = async (req, res) => {
    const { nombre, id_categoria } = req.body;

    try {
        const query = `INSERT INTO SUBCATEGORIAS (NOMBRE, ID_CATEGORIA)
            VALUES (:nombre, :id_categoria)`;
        const params = {
            nombre,
            id_categoria
        };
        result = await db.executeQuery(query, params);

        return res.status(201).json({
            message: 'Subcategoría creada exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al crear la subcategoría',
            error
        });
    };
};

const getAllSubcategories = async (req, res) => {
    try {
        const query = `SELECT * FROM SUBCATEGORIAS`;
        const result = await db.executeQuery(query);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener las subcategorías',
            error
        });
    };
};

const getSubcategoryById = async (req, res) => {
    const { id_subcategoria } = req.params;

    try {
        const query = `SELECT * FROM SUBCATEGORIAS WHERE ID_SUBCATEGORIA = :id_subcategoria`;
        const params = [id_subcategoria];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Subcategoría no encontrada'
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener la subcategoría',
            error
        });
    };
};

const getSubcategoriesByCategory = async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const query = `SELECT * FROM SUBCATEGORIAS WHERE ID_CATEGORIA = :id_categoria`;
        const params = [id_categoria];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron subcategorías para esta categoría'
            });
        }

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener las subcategorías por categoría',
            error
        });
    };
};

const updateSubcategoryById = async (req, res) => {
    const { id_subcategoria } = req.params;
    const { nombre, id_categoria } = req.body;

    try {
        const query = `UPDATE SUBCATEGORIAS SET NOMBRE = :nombre, ID_CATEGORIA = :id_categoria
            WHERE ID_SUBCATEGORIA = :id_subcategoria`;
        const params = {
            nombre,
            id_categoria,
            id_subcategoria
        };
        result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Subcategoría no encontrada'
            });
        }

        return res.status(200).json({
            message: 'Subcategoría actualizada exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al actualizar la subcategoría',
            error
        });
    };
};

const deleteSubcategoryById = async (req, res) => {
    const { id_subcategoria } = req.params;

    try {
        const query = `DELETE FROM SUBCATEGORIAS WHERE ID_SUBCATEGORIA = :id_subcategoria`;
        const params = [id_subcategoria];
        result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Subcategoría no encontrada'
            });
        }

        return res.status(200).json({
            message: 'Subcategoría eliminada exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al eliminar la subcategoría',
            error
        });
    };
};

module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    getSubcategoriesByCategory,
    updateSubcategoryById,
    deleteSubcategoryById
};