import { db } from "../repositories/index";
import { v4 as uuidv4 } from "uuid";
import { Cart } from "../types/types";

/**
 * Service function to create a user cart.
 * @param userId The ID of the user for whom the cart is created.
 * @returns The created cart.
 */
export async function createUserCart(userId: string): Promise<Cart> {
  try {
    const cartId = uuidv4();

    // Check if a user's cart already exists in the database.
    const userCart = await db.oneOrNone('SELECT * FROM carts WHERE user_id = $1 AND is_deleted = $2', [userId, false]);

    if (!userCart) {
      // User's cart doesn't exist; create a new cart in the database.
      const newCart = {
        id: cartId,
        userId: userId,
        isDeleted: false,
        items: [],
      };

      await db.none('INSERT INTO carts (id, user_id, is_deleted, items) VALUES ($1, $2, $3, $4)',
        [newCart.id, newCart.userId, newCart.isDeleted, newCart.items]);

      return newCart;
    } else {
      // User's cart already exists in the database.
      return userCart;
    }
  } catch (error) {
    throw new Error("Error creating cart");
  }
}

export async function getUserCart(userId: string): Promise<Cart> {
  try {
    // Retrieve the user's cart from the database.
    const userCart = await db.oneOrNone('SELECT * FROM carts WHERE user_id = $1 AND is_deleted = $2', [userId, false]);

    if (userCart) {
      // User's cart exists in the database.
      return userCart;
    } else {
      // User's cart doesn't exist; create a new cart.
      const cartId = uuidv4();
      const newCart = {
        id: cartId,
        userId: userId,
        isDeleted: false,
        items: [],
      };

      await db.none('INSERT INTO carts (id, user_id, is_deleted, items) VALUES ($1, $2, $3, $4)',
        [newCart.id, newCart.userId, newCart.isDeleted, newCart.items]);

      return newCart;
    }
  } catch (error) {
    throw new Error("Error fetching user cart");
  }
}

export async function updateUserCart(userId: string, updatedCart: Cart): Promise<Cart> {
  try {
    // Check if the user's cart exists in the database.
    const userCart = await db.oneOrNone('SELECT * FROM carts WHERE user_id = $1 AND is_deleted = $2', [userId, false]);

    if (userCart) {
      // User's cart exists; update it in the database.
      await db.none('UPDATE carts SET items = $1 WHERE user_id = $2', [updatedCart.items, userId]);
    } else {
      // User's cart doesn't exist; create a new cart.
      const cartId = uuidv4();
      const newCart = {
        id: cartId,
        userId: userId,
        isDeleted: false,
        items: updatedCart.items,
      };

      await db.none('INSERT INTO carts (id, user_id, is_deleted, items) VALUES ($1, $2, $3, $4)',
        [newCart.id, newCart.userId, newCart.isDeleted, newCart.items]);
    }

    return updatedCart;
  } catch (error) {
    throw new Error("Error updating user cart");
  }
}

export async function deleteUserCart(userId: string): Promise<void> {
  try {
    // Mark the user's cart as deleted in the database.
    await db.none('UPDATE carts SET is_deleted = $1 WHERE user_id = $2', [true, userId]);
  } catch (error) {
    throw new Error("Error marking user cart as deleted");
  }
}
