import { sequelize } from "../config/dbConfig";
import { role } from "../types/commonTypes";
import { Optional, DataTypes, Model } from "sequelize";
import addressModel, {
  addressCreationAttributes,
  addressInstance,
} from "./addressModel";
import imageModel from "./imageModel";
import productModel, {
  productCreationAttributes,
  productInstance,
} from "./productModel";
import cartModel, { cartCreationAttributes, cartInstance } from "./cartModel";
import helpAndSupportModel, {
  helpAndSupportInstance,
  helpAndSupportCreationAttributes,
} from "./helpAndSupportModel";
import businessModel, { businessInstance } from "./businessModel";
import { userNotificationPrefInstance } from "./userNotificationPrefModel";
import notificationModel, {
  notification,
  notificationCreationAttributes,
  notificationInstance,
} from "./notificationModel";
export interface user {
  id: number;
  fullName: string;
  email: string;
  phNumber: string;
  gender: string;
  role: role;
  password: string;
  verified: boolean;
  fcmToken: string;
  profileUrl: string;
  dateOfBirth: Date;
  cartId: number;
  language: string;
}

type userCreationAttributes = Optional<
  user,
  | "id"
  | "fcmToken"
  | "gender"
  | "verified"
  | "profileUrl"
  | "dateOfBirth"
  | "cartId"
  | "language"
>;
export interface userInstance
  extends Model<user, userCreationAttributes>,
    user {
  getHelp(args: any): Promise<helpAndSupportInstance[]>;
  createHelp(
    args: helpAndSupportCreationAttributes
  ): Promise<helpAndSupportInstance>;
  createCart(): Promise<cartInstance>;
  getProducts(param?: any): Promise<productInstance[]>;
  createProduct(params: productCreationAttributes): Promise<productInstance>;
  addProducts(param: any): Promise<any>;
  createAddress(params: addressCreationAttributes): Promise<addressInstance>;
  getAddress(): Promise<addressInstance[]>;
  getCart(): Promise<cartInstance[]>;
  setBusiness(param: any): Promise<any>;
  getBusiness(param?: any): Promise<businessInstance>;
  getNotificationPref(param?: any): Promise<userNotificationPrefInstance[]>;
  getNotifications(param?: any): Promise<notificationInstance[]>;
  createNotifications(
    param: notificationCreationAttributes
  ): Promise<notificationInstance>;
  createdAt: Date;
  updatedAt: Date;
}

const userModel = sequelize.define<userInstance>(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,

      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phNumber: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "CUSTOMER", "SELLER"),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fcmToken: {
      type: DataTypes.STRING,
    },
    profileUrl: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    cartId: {
      type: DataTypes.INTEGER,
    },
    language: {
      type: DataTypes.STRING,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

userModel.hasMany(productModel, {
  as: "products",
  foreignKey: "product_owner",
});
productModel.belongsTo(userModel, { as: "owner", foreignKey: "product_owner" });
userModel.hasMany(addressModel, { as: "address", foreignKey: "user_id" });
userModel.hasOne(businessModel, { foreignKey: "user_id", as: "business" });

userModel.hasOne(cartModel, { as: "cart", foreignKey: "user_id" });

userModel.hasMany(notificationModel, {
  as: "notifications",
  foreignKey: "user_id",
});
notificationModel.belongsTo(userModel, {
  as: "reciever",
  foreignKey: "user_id",
});

userModel.hasMany(helpAndSupportModel, { as: "Help", foreignKey: "user_id" });
// userModel.hasMany(imageModel, { as: "images", foreignKey: "help_user_id" });

export default userModel;
