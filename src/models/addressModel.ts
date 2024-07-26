import { sequelize } from "../config/dbConfig";
import { role } from "../types/commonTypes";
import {
  Optional,
  ModelDefined,
  DataTypes,
  DATE,
  Model,
  DatabaseError,
} from "sequelize";
export interface address {
  id: number;
  addressLine1: string;
  addressLine2: string;
  street: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  pincode: string;
}

export type addressCreationAttributes = Optional<
  address,
  | "id"
  | "city"
  | "landmark"
  | "addressLine1"
  | "addressLine2"
  | "latitude"
  | "longitude"
  | "district"
>;
export interface addressInstance
  extends Model<address, addressCreationAttributes>,
    address {
  createdAt: Date;
  updatedAt: Date;
}

const addressModel = sequelize.define<addressInstance>("address", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  street: {
    type: DataTypes.STRING,
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLine2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  addressLine1: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default addressModel;
