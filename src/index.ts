import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import {
  checkoutOrder,
  createCart,
  deleteCart,
  deleteUser,
  getAllUsers,
  getCart,
  getProductById,
  getProductsList,
  updateCart,
  userLogin,
  userRegistration,
} from "./controllers";
import { authenticateUser, CurrentUser } from "./auth";
import mongoose from "mongoose";
import { isAdmin } from "./middleware/isAdmin";

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}

dotenv.config();
console.log(process.env.TOKEN_KEY);
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
    app.post("/register", userRegistration);

    // Login user
    app.post("/login", userLogin);

    // Get users
    app.get("/api/users", getAllUsers);

    // Delete User
    app.delete("/api/users/:id", deleteUser);

    app.use("/api", authenticateUser);

    // Create user cart
    app.post("/api/profile/cart", createCart);

    // Get user cart
    app.get("/api/profile/cart", getCart);

    // Update user cart
    app.put("/api/profile/cart", updateCart);

    // Empty user cart
    app.delete("/api/profile/cart", isAdmin, deleteCart);

    // Create an order
    app.post("/api/profile/cart/checkout", checkoutOrder);

    // Returns a list of products
    app.get("/api/products", getProductsList);

    // Returns a single product
    app.get("/api/products/:productId", getProductById);

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
