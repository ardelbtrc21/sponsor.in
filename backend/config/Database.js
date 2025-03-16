import { createNamespace } from "cls-hooked";
import process from "node:process";
import pg from "pg";
import { Sequelize } from "sequelize";
const namespace = createNamespace("sequelize-transaction");
Sequelize.useCLS(namespace);
const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, } = process.env;
if (DATABASE_NAME == null ||
    DATABASE_USER == null ||
    DATABASE_PASSWORD == null ||
    DATABASE_HOST == null ||
    DATABASE_PORT == null) {
    console.error("Database environment variables is not filled properly.");
    console.error("Please check your .env file!");
    process.exit(1);
}
const db = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    dialect: "postgres",
    logging: false,
});
// pg.types.setTypeParser(20, parseBigint);
db.authenticate()
    .then(() => {
    console.error("Database Postgres Connected..");
})
    .catch((err) => {
    console.error("Error" + err);
});
export default db;