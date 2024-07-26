import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

export interface languageAttributes {
  id: number;
  language: string;
}

export type languageCreationAttributes = Optional<languageAttributes, "id">;

export interface languageInstance
  extends Model<languageAttributes, languageCreationAttributes>,
    languageAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const languageModel = sequelize.define<languageInstance>("languageModel", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  language: {
    type: DataTypes.STRING,
  },
});

export default languageModel;
