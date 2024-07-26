import { sequelize } from "../config/dbConfig";
import { Optional, DataTypes, Model } from "sequelize";

type productCondition = "New Product" | "Already Used" | "Pre Order";

export interface document {
  id: number;
  docUrl: string;
}

export type documentCreationAttributes = Optional<document, "id">;
interface documentInstance
  extends Model<document, documentCreationAttributes>,
    document {
  createdAt: Date;
  updatedAt: Date;
}

const documentModel = sequelize.define<documentInstance>("document", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  docUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default documentModel;
