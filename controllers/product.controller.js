const db = require('../config/db.config.js');

const createProduct = async (req, res) => {
    const { nombre, descripcion, precio, stock, id_subcategoria } = req.body;

    try {
        const query = `INSERT INTO PRODUCTOS (NOMBRE, DESCRIPCION, PRECIO, STOCK, ID_SUBCATEGORIA)
            VALUES (:nombre, :descripcion, :precio, :stock, :id_subcategoria)`;
        const params = {
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria
        };
        result = await db.executeQuery(query, params);

        return res.status(201).json({
            message: 'Producto creado exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al crear el producto',
            error
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const query = `SELECT * FROM PRODUCTOS`;
        const result = await db.executeQuery(query);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener los productos',
            error
        });
    }
}

const getProductById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const query = `SELECT * FROM PRODUCTOS WHERE ID_PRODUCTO = :id_producto`;
        const params = [id_producto];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener el producto',
            error
        });
    };
};

const getProductsBySubcategory = async (req, res) => {
    const { id_subcategoria } = req.params;

    try {
        const query = `SELECT * FROM PRODUCTOS WHERE ID_SUBCATEGORIA = :id_subcategoria`;
        const params = [id_subcategoria];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron productos para esta subcategoría'
            });
        }

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener los productos por subcategoría',
            error
        });
    };
};

const updateProductById = async (req, res) => {
    const { id_producto } = req.params;
    const { nombre, descripcion, precio, stock, id_subcategoria } = req.body;

    try {
        const query = `UPDATE PRODUCTOS SET NOMBRE = :nombre, DESCRIPCION = :descripcion, PRECIO = :precio,
            STOCK = :stock, ID_SUBCATEGORIA = :id_subcategoria WHERE ID_PRODUCTO = :id_producto`;
        const params = {
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria,
            id_producto
        };
        result = await db.executeQuery(query, params);

        return res.status(200).json({
            message: 'Producto actualizado exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al actualizar el producto',
            error
        });
    };
};

const deleteProductById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const query = `DELETE FROM PRODUCTOS WHERE ID_PRODUCTO = :id_producto`;
        const params = [id_producto];

        const result = await db.executeQuery(query, params);

        return res.status(200).json({
            message: 'Producto eliminado exitosamente',
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al eliminar el producto',
            error
        });
    };
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsBySubcategory,
    updateProductById,
    deleteProductById
};