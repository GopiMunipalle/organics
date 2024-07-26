import { sequelize } from "../config/dbConfig";

import { Optional, DataTypes, Model } from "sequelize";

export interface imageUrl {
  id: number;
  url: string;
}

export type imageUrlCreationAttributes = Optional<imageUrl, "id">;
export interface imageInstance
  extends Model<imageUrl, imageUrlCreationAttributes>,
    imageUrl {
  createdAt: Date;
  updatedAt: Date;
}

const imageModel = sequelize.define<imageInstance>("image", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
  },
});

export default imageModel;
