require('dotenv').config();
const oracledb = require('oracledb');

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

module.exports = { executeQuery, oracledb };

