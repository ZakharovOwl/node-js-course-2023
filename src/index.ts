import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import {
  checkoutOrder,
  createCart,
  deleteCart,
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
import net from "net";
import debug from "debug";
import morgan from "morgan";
import logger from "./logs/logger";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "./constants/responseCodes";

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);

const debugLogger = debug("node-app");

let connections: net.Socket[] = [];

server.on("connection", (connection) => {
  // register connections
  connections.push(connection);

  // remove/filter closed connections
  connection.on("close", () => {
    connections = connections.filter(
      (currentConnection) => currentConnection !== connection,
    );
  });
});

server.on("listening", () => {
  console.log(`Server is listening on port ${port}`);
});

function gracefulShutdown() {
  console.log("Received kill signal, shutting down gracefully");

  server.close((err) => {
    if (err) {
      console.error("Error while closing server:", err);
      process.exit(1);
    }

    console.log("Server closed out remaining connections");
    process.exit(0);
  });

  // Force close the server after a certain time
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);

  // Close connections gracefully
  connections.forEach((connection) => {
    connection.end();
  });

  // Forcefully destroy connections after a certain time
  setTimeout(() => {
    connections.forEach((connection) => {
      connection.destroy();
    });
  }, 5000);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

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

    app.use(
      morgan("combined", {
        stream: {
          write: (message: string) => {
            logger.info(message.trim());
          },
        },
      }),
    );

    app.use(bodyParser.json());

    app.get("/health", async (req, res) => {
      try {
        // Check database connection
        await mongoose.connection.db.admin().ping();

        // Return success response
        res.status(RESPONSE_CODE_OK).json({
          message: "Application is healthy",
          database: "connected",
        });

        debugLogger("Health check succeeded");
      } catch (error) {
        // Return error response
        res.status(RESPONSE_CODE_SERVER_ERROR).json({
          message: "Application is unhealthy",
          database: "disconnected",
        });

        debugLogger("Health check failed: %O", error);
      }
    });

    // Create user
    app.post("/register", userRegistration);

    // Login user
    app.post("/login", userLogin);

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

    // app.listen(port, () => {
    //   console.log(`Server is running on port ${port}`);
    // });
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
  }
}

main().catch((error) => {
  console.error(error);
});
