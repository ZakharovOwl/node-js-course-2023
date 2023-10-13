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
import { MikroORM } from "@mikro-orm/core";
import config from "../config/mikro-orm.config";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedDataSeeder } from "../seeders/SeedDataSeeder";

const app = express();
const port = process.env.PORT || 3000;

async function main() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  await orm.getMigrator().up(); // getMigrator
  const em = orm.em.fork();
  if (await orm.isConnected()) {
    console.log("Connected to the database");
    const seeder = new SeedDataSeeder();
    await seeder.run(em);
    console.log("Added data for tests");
  } else {
    console.log("Error: Connect to the database");
  }

  app.use((req, res, next) => {
    (req as any).orm = orm;
    next();
  });

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
}

main().catch((error) => {
  console.error(error);
});
