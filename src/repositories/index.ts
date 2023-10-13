import express from "express";
import bodyParser from "body-parser";
import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
} from "../controllers/cart";
import { checkoutOrder } from "../controllers/order";
import { getProductById, getProductsList } from "../controllers/products";
import { authenticateUser } from "../auth";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
} from "../controllers/userController";


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const pgp = require("pg-promise")();
export const db = pgp({
  user: "node_db",
  password: "password123",
  host: "localhost",
  port: 5432,
  database: "node_db",
});
app.use((req, res, next) => {
  // @ts-ignore
  req.db = db;
  next();
});
db.connect()
  .then(() => {
    console.log("Successfully connected to the PostgreSQL database");
  })
  .catch((error: any) => {
    console.error("DB error:", error);
  });

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
