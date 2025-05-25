require('dotenv').config();
const oracledb = require('oracledb');
const { Sequelize } = require('sequelize'); 

const sequelize = new Sequelize({
    dialect: 'oracle',
    dialectModule: oracledb,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialectOptions: {
      connectString: process.env.DB_CONNECTION_STRING
    },
    logging: console.log // Para ver queries en consola
  });
  
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
    }
  })();
  
  const db = {};
  
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  
  db.User = require('../models/users.models.js')(sequelize, Sequelize);
  db.Category = require('../models/categorys.model.js')(sequelize, Sequelize);
  db.SubCategory = require('../models/subCategorys.models.js')(sequelize, Sequelize);
  db.Product = require('../models/products.model.js')(sequelize, Sequelize);
  db.ShoppingCart = require('../models/shoppingCart.model.js')(sequelize, Sequelize);
  db.CartDetails = require('../models/cartDetails.model.js')(sequelize, Sequelize);
  db.Pedido = require('../models/pedido.model.js')(sequelize, Sequelize);
  db.Envio = require('../models/envio.model.js')(sequelize, Sequelize);
  db.TipoPago = require('../models/tipoPago.model.js')(sequelize, Sequelize);
  db.DetallesPedido = require('../models/detallesPedido.model.js')(sequelize, Sequelize);
  db.Venta = require('../models/ventas.model.js')(sequelize, Sequelize);
  db.Pago = require('../models/pago.model.js')(sequelize, Sequelize);
  
  module.exports = db;