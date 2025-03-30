const { v4: uuidv4 } = require('uuid');
const db = require('../config/db.config.js');

const createCategory = async (req, res) => {
    const { nombre} = req.body;

    try {
        const query = `INSERT INTO CATEGORIAS (NOMBRE)
            VALUES (:nombre)
            RETURNING ID_CATEGORIA
            INTO :id_categoria`;
            const id_categoria = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };
        const params = {
            nombre,
            id_categoria
        };
        result = await db.executeQuery(query, params);

        if (result.outBinds && result.outBinds.id_categoria) {
            const newId = result.outBinds.id_categoria[0];
            const response = {
                timestamp: new Date().toISOString(),
                requestId: uuidv4(),
                message: "Categoría creada exitosamente",
                status: "success",
                data: {
                    id: newId,
                    nombre: nombre
                }
            };
            res.status(201).json(response);
        } else {
            throw new Error('Error al obtener el ID de la categoría creada');
        };
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al crear la categoría',
            error: error.message
        });
    };
};

const getAllCategories = async (req, res) => {
    try {
        const query = `SELECT * FROM CATEGORIAS`;
        const result = await db.executeQuery(query);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener las categorías',
            error
        });
    };
};

const getCategoryById = async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const query = `SELECT * FROM CATEGORIAS WHERE ID_CATEGORIA = :id_categoria`;
        const params = [id_categoria];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener la categoría',
            error
        });
    };
};

const updateCategoryById = async (req, res) => {
    const { id_categoria } = req.params;
    const { nombre } = req.body;

    try {
        const query = `UPDATE CATEGORIAS SET NOMBRE = :nombre WHERE ID_CATEGORIA = :id_categoria`;
        const params = {
            nombre,
            id_categoria
        };
        result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        return res.status(200).json({
            message: 'Categoría actualizada exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al actualizar la categoría',
            error
        });
    };
};

const deleteCategoryById = async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const query = `DELETE FROM CATEGORIAS WHERE ID_CATEGORIA = :id_categoria`;
        const params = [id_categoria];
        result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        return res.status(200).json({
            message: 'Categoría eliminada exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al eliminar la categoría',
            error
        });
    };
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
};