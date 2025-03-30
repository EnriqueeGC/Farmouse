require('dotenv').config();
const oracledb = require('oracledb');
const { Sequelize } = require('sequelize');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const executeQuery = async (query, params = []) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        const result = await connection.execute(query, params, { autoCommit: true });
        return result;
    } catch (error) {
        console.error('Error to execute the query: ', error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error to close the connection: ', error);
            };
        };
    };
};

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

module.exports = db;

