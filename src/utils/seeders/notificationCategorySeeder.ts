import notificationCategoryModel from "../../models/notificationCategoryModel";
import notificationTypeModel, {
  notificationTypes,
  notificationTypesCreationAttributes,
} from "../../models/notificationTypesModel";
const data: { name: any; id: number }[] = [
  {
    id: 1,
    name: "Orders",
  },
  {
    id: 2,
    name: "Shipping",
  },
  {
    id: 3,
    name: "Local Delivery",
  },
];

export async function seedNotificationCat() {
  try {
    data.forEach(async (item) => {
      await notificationCategoryModel.create(item);
      console.log(`added ${item.name}`);
    });
  } catch (err) {
    console.log(err);
  }
}

interface notData extends notificationTypesCreationAttributes {
  categoryId: number;
}

const notficationTypeData: notData[] = [
  //orders
  {
    name: "Order Confirmation",
    description:
      "Sent automatically to the customer after they place their order",
    categoryId: 1,
    role: "SELLER",
  },
  {
    name: "Order Edited",
    description:
      "Sent to the customer after their order is edited(if you select this option)",
    categoryId: 1,
    role: "SELLER",
  },
  {
    name: "Order Invoice",
    description:
      "Sent to the customer when the order has an outstanding balance",
    categoryId: 1,
    role: "SELLER",
  },
  {
    name: "Order Cancelled",
    description:
      "Sent automatically to the customer if their order is cancelled(if you select this option)",
    categoryId: 1,
    role: "SELLER",
  },
  {
    name: "Order Refund",
    description:
      "Sent automatically to the customer if their order is refunded(if you select this option)",
    categoryId: 1,
    role: "SELLER",
  },
  {
    name: "Payment Error",
    description:
      "Sent automatically to the customer if their payment can't be processed during checkout.",
    categoryId: 1,
    role: "SELLER",
  },
  //shipping
  {
    name: "Fullfilment Request",
    description:
      "Sent automatically to the third-party fulfillment service provider when order items are fulfilled.",
    categoryId: 2,
    role: "SELLER",
  },
  {
    name: "Shipping Confirmation",
    description:
      "Sent automatically to the customer when their order is fulfilled(if you select this option).",
    categoryId: 2,
    role: "SELLER",
  },
  {
    name: "Shipping Update",
    description:
      "Sent automatically to the customer if their fulfilled order's tracking number is updated.",
    categoryId: 2,
    role: "SELLER",
  },
  // Local delivery
  {
    name: "Local order out for deliver",
    description:
      "Sent to the customer when their local order is out for delivery.",
    categoryId: 3,
    role: "SELLER",
  },
  {
    name: "Local order delivered",
    description: "Sent to the customer when their local order delivered.",
    categoryId: 3,
    role: "SELLER",
  },
  {
    name: "Local order missed delivery",
    description: "Sent to the customer when they miss a local delivery.",
    categoryId: 3,
    role: "SELLER",
  },
];

export async function seedSellerNotificationType() {
  try {
    for (const item of notficationTypeData) {
      await notificationTypeModel.create(item);
      console.log(`added ${item.name}`);
    }
    console.log("seeding completed");
  } catch (err) {
    console.log(err);
  }
}
