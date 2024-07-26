import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";
import userModel from "./userModel";
import imageModel, {
  imageInstance,
  imageUrlCreationAttributes,
} from "./imageModel";

export interface helpAndSupportAttributes {
  id: number;
  title: string;
  description: string;
  status: string;
  comment: string;
}

export type helpAndSupportCreationAttributes = Optional<
  helpAndSupportAttributes,
  "id" | "status" | "comment"
>;

export interface helpAndSupportInstance
  extends Model<helpAndSupportAttributes, helpAndSupportCreationAttributes>,
    helpAndSupportAttributes {
  // images: imageInstance[];
  createImage(arg0: imageUrlCreationAttributes): Promise<imageInstance>;
  createdAt: Date;
  updatedAt: Date;
}

const helpAndSupportModel = sequelize.define<helpAndSupportInstance>(
  "helpAndsupportModel",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
  }
);

helpAndSupportModel.hasMany(imageModel, {
  as: "images",
  foreignKey: "help_support_id",
  onDelete: "CASCADE",
});

export default helpAndSupportModel;
