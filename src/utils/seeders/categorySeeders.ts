import categoryModel from "../../models/categoryModel";
const data = [
  {
    categoryName: "Organic Food",
  },
  {
    categoryName: "skin Care",
  },
  {
    categoryName: "Body Care",
  },
  {
    categoryName: "Hair Care",
  },
  {
    categoryName: "Aroma Therapy",
  },
  {
    categoryName: "Home Care",
  },
  {
    categoryName: "Teja Organics",
  },
];

export async function seedCategory() {
  try {
    data.forEach(async (item) => {
      await categoryModel.create(item);
      console.log(`added ${item.categoryName}`);
    });
  } catch (err) {
    console.log(err);
  }
}
