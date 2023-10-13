import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User, Cart, Order, Product } from "../entities";

const config: Options<PostgreSqlDriver> = {
  entities: ["./dist/entities"],
  entitiesTs: [Product, User, Cart, Order],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
  },
  type: "postgresql",
  clientUrl: "postgresql://node_db:password123@localhost:5432/node_db",
};

export default config;
