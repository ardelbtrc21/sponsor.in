const dotenv = require('dotenv');
dotenv.config()
const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, } = process.env;

module.exports = {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    dialect: "postgres",
    logging: false,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    username: DATABASE_USER
};