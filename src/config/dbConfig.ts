import { Sequelize } from "sequelize";

const database = process.env.DATABASE || "postgres";
const dbUser = process.env.DBUSER || "";
const dbPassword = process.env.DBPASSWORD || "";
const host = process.env.DBHOST || "localhost";

export const sequelize = new Sequelize(database, dbUser, dbPassword, {
  host: host,
  dialect: "postgres",
  logging: false,
});
