import { EntityManager } from "@mikro-orm/core";
import { User, Cart } from "../entities";

export async function createUserCart(
  em: EntityManager,
  userId: string,
): Promise<Cart> {
  try {
    const user = await em.findOneOrFail(User, userId);
    const newCart = new Cart(user);
    await em.persistAndFlush(newCart);

    return newCart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Error creating cart");
  }
}

export async function getUserCart(
  em: EntityManager,
  userId: string,
): Promise<Cart> {
  const user = await em.findOneOrFail(User, userId);
  const userCart = await em.findOne(Cart, { user, isDeleted: false });

  if (userCart) {
    return userCart;
  } else {
    const newCart: Cart = new Cart(user);
    em.persist(newCart);

    return newCart;
  }
}
