import { Cart, User } from "../models";
import { ICartItem, ICart } from "../types/types";
import { updateCartSchema } from "../helpers/validations";
import { calculateTotalPrice } from "../helpers/totalPrice";

export async function createUserCart(
  userId: string,
  items: ICartItem[],
): Promise<ICart> {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userCart = await Cart.findOne({ user, isDeleted: false });
    if (userCart) {
      return userCart;
    } else {
      const newCart = new Cart({ user });

      if (items && items.length > 0) {
        for (const item of items) {
          const { product, count } = item;

          newCart.items.push({ product, count });
        }
      }

      newCart.totalPrice = calculateTotalPrice(items);

      await newCart.save();

      return newCart;
    }
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Error creating cart");
  }
}

export async function getUserCart(userId: string): Promise<ICart> {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const userCart = await Cart.findOne({ user, isDeleted: false });

  if (!userCart) {
    throw new Error("Cart not found");
  }

  return userCart;
}

export async function updateUserCart(
  userId: string,
  cartItems: ICartItem[],
): Promise<ICart> {
  try {
    const userCart = await Cart.findOne({
      user: userId,
      isDeleted: false,
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    await updateCartSchema.validateAsync({
      user: userId,
      isDeleted: userCart.isDeleted,
      items: cartItems,
    });

    userCart.items = [];
    userCart.totalPrice = calculateTotalPrice(cartItems);

    for (const item of cartItems) {
      const { product, count } = item;
      userCart.items.push({ product, count });
    }

    await userCart.save();

    return userCart;
  } catch (error) {
    console.error("Error updating user cart:", error);
    throw new Error("Error updating user cart");
  }
}
