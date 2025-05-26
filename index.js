require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db.config.js'); // Importa la conexión a la base de datos

const app = express();
const port = process.env.PORT || 3000; // 3000 is the default port

const userRoutes = require('./routes/user.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const subCategoryRoutes = require('./routes/subCategory.routes.js');
const productRoutes = require('./routes/product.routes.js');
const shoppingCartRoutes = require('./routes/shoppingCart.routes.js');
const paymentRoutes = require('./routes/payment.routes.js');
const webhooksRoutes = require('./routes/stripeWebhooks.routes.js');
const facturaRoutes = require('./routes/factura.routes.js');
const pedidoRoutes = require('./routes/pedido.routes.js');
const ventaRoutes = require('./routes/venta.routes.js');

// Middleware para manejar el cuerpo de las solicitudes
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json"); // Tipo de contenido
    res.setHeader("X-Powered-By", "Edgar's API"); // Ejemplo de encabezado personalizado
    next(); // Pasa al siguiente middleware o ruta
});

app.use('/api/webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json());

// Routes 
app.use('/user', userRoutes);   
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subCategoryRoutes);
app.use('/product', productRoutes);
app.use('/shoppingCart', shoppingCartRoutes);
app.use('/api/payment', paymentRoutes)
app.use('/api/webhook/', webhooksRoutes);
app.use('/api/factura', facturaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/ventas', ventaRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
        return sequelize.sync(); // Esto sincroniza los modelos con la BD
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar la base de datos:', err);
    });
