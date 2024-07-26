import { sequelize } from "../config/dbConfig";
import { Optional, DataTypes, Model } from "sequelize";
import addressModel from "./addressModel";
import documentModel from "./documentsModel";

type accountType = "SAVINGS" | "CURRENT";

export interface businessInterface {
  id: number;
  gstNumber: string;
  shopName: string;
  accountNumber: string;
  accountHolderName: string;
  ifseCode: string;
  accountType: accountType;
}

export type businessCreationAttributes = Optional<businessInterface, "id">;
export interface businessInstance
  extends Model<businessInterface, businessCreationAttributes>,
    businessInterface {
  createdAt: Date;
  updatedAt: Date;
  setAddress(params?: any): Promise<any>;
  addAddress(params?: any): Promise<any>;
}

const businessModel = sequelize.define<businessInstance>("businessdetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  gstNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  shopName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ifseCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM("SAVINGS", "CURRENT"),
    allowNull: false,
  },
});

businessModel.hasMany(addressModel, {
  foreignKey: "business_id",
  as: "address",
});
// addressModel.belongsTo(businessModel, {
//   foreignKey: "address_id",
//   as: "business",
// });

businessModel.hasMany(documentModel, {
  foreignKey: "business_id",
  as: "documents",
});

export default businessModel;
