import { sequelize } from "../config/dbConfig";
import { Optional, DataTypes, Model } from "sequelize";
import productModel from "./productModel";
import { resolveContent } from "nodemailer/lib/shared";
import userModel, { userInstance } from "./userModel";

export interface ticket {
  id: number;
  name: string;
  description: string;
  type: "BOOKING" | "BUG" | "APPLICATION ISSUE";
  resolved: boolean;
  comment: string;
}

export type ticketCreationAttirbutes = Optional<
  ticket,
  "id" | "name" | "comment"
>;
export interface ticketInstance
  extends Model<ticket, ticketCreationAttirbutes>,
    ticket {
  createdAt: Date;
  updatedAt: Date;
  setRaisedUser(param: any): Promise<any>;
  getRaisedUser(param?: any): Promise<userInstance>;
  setResolvedUser(param: any): Promise<any>;
}

const ticketModel = sequelize.define<ticketInstance>("tickets", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  comment: {
    type: DataTypes.TEXT,
  },
});

ticketModel.belongsTo(userModel, {
  as: "resolvedUser",
  foreignKey: "resolved_by",
});
ticketModel.belongsTo(userModel, { as: "raisedUser", foreignKey: "raised_by" });
userModel.hasMany(ticketModel);

export default ticketModel;
