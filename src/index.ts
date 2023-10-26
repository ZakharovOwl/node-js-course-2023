import express from "express";
import bodyParser from "body-parser";
import {
  checkoutOrder,
  createCart,
  createUserHandler,
  deleteCart,
  deleteUserHandler,
  getAllUsersHandler,
  getCart,
  getProductById,
  getProductsList,
  updateCart,
} from "./controllers";
import { authenticateUser } from "./auth";
import mongoose from "mongoose";

const app = express();
const port = 3000;

async function main() {
  const mongoDB =
    "mongodb+srv://test:test1@cluster0.f5eo0x4.mongodb.net/node-express-0";

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "node-express-0",
  };

  try {
    await mongoose.connect(mongoDB, options);
    console.log("Connected to MongoDB");

    app.use(bodyParser.json());

    // Create user
    app.post("/api/user", createUserHandler);

    // Get users
    app.get("/api/users", getAllUsersHandler);

    // Update user cart
    app.delete("/api/users/:id", authenticateUser, deleteUserHandler);

    // Create user cart
    app.post("/api/profile/cart", authenticateUser, createCart);

    // Get user cart
    app.get("/api/profile/cart", authenticateUser, getCart);

    // Update user cart
    app.put("/api/profile/cart", authenticateUser, updateCart);

    // Empty user cart
    app.delete("/api/profile/cart", authenticateUser, deleteCart);

    // Create an order
    app.post("/api/profile/cart/checkout", authenticateUser, checkoutOrder);

    // Returns a list of products
    app.get("/api/products", authenticateUser, getProductsList);

    // Returns a single product
    app.get("/api/products/:productId", authenticateUser, getProductById);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
  }
}

main().catch((error) => {
  console.error(error);
});
