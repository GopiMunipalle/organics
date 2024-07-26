import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { sequelize } from "./config/dbConfig";
import seedData from "./utils/seeders/seedData";
import { feedUserSettings } from "./library/userLibrary";

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
      // seedData();
    });
  } catch (err) {
    console.log(err);
    process.exit();
  }
}
startServer();
