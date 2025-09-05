import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    inStock: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String, // path of uploaded image
      default: ""
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("FarmerProduct", productSchema);

export default Product;
