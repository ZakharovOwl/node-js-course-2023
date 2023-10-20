import mongoose from "mongoose";

async function addTestData() {
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

    const db = mongoose.connection;

    const productsCollection = db.collection("products");
    const products: any = [];
    for (let i = 1; i <= 10; i++) {
      const product: any = {
        title: `Product ${i}`,
        description: `Description ${i}`,
        price: 10.0 * i,
      };
      products.push(product);
    }
    const result = await productsCollection.insertMany(products);
    console.log(`${result.insertedCount} products inserted`);

    const usersCollection = db.collection("users");
    const cartsCollection = db.collection("carts");
    const ordersCollection = db.collection("orders");

    for (let i = 1; i <= 5; i++) {
      const user = {
        username: `User ${i}`,
        email: `user${i}@example.com`,
      };

      const userId = (await usersCollection.insertOne(user)).insertedId;

      const cart1 = {
        isDeleted: false,
        items: [
          { product: products[i - 1]._id, count: 1 },
          { product: products[i]._id, count: 2 },
        ],
        user: userId,
      };

      const cart1Id = (await cartsCollection.insertOne(cart1)).insertedId;

      const order1 = {
        user: userId,
        cartId: cart1Id,
        items: cart1.items,
        payment: {
          type: "credit card",
          address: "123 Main St",
          creditCard: "1234-5678-9012-3456",
        },
        delivery: {
          type: "standard",
          address: "456 Oak St",
        },
        comments: "pending",
        totalPrice: 100.0,
      };

      await ordersCollection.insertOne(order1);

      if (i % 2 === 0) {
        const cart2 = {
          isDeleted: false,
          items: [
            { product: products[i].count, count: 1 },
            { product: products[i + 1]._id, count: 2 },
          ],
          user: userId,
        };

        const cart2Id = (await cartsCollection.insertOne(cart2)).insertedId;

        const order2 = {
          user: userId,
          cartId: cart2Id,
          items: cart2.items,
          payment: {
            type: "credit card",
            address: "456 Main St",
            creditCard: "5678-9012-3456-1234",
          },
          delivery: {
            type: "express",
            address: "789 Oak St",
          },
          comments: "pending",
          totalPrice: 150.0,
        };

        await ordersCollection.insertOne(order2);
      }
    }
    console.log("Test data added successfully");
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
  } finally {
    mongoose.connection.close();
    process.exit();
    console.log("Test data process is ended");
  }
}

addTestData();
