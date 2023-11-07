import { Request, Response } from "express";
import {
  RESPONSE_CODE_CREATED,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { createUserCart, getUserCart, updateUserCart } from "../services/cart";
import { Cart } from "../models";
import { CurrentUser } from "../auth";
import { calculateTotalPrice } from "../helpers/totalPrice";

export async function createCart(req: Request, res: Response) {
  try {
    const { userId } = req.user as CurrentUser;
    const { items } = req.body;
    const cart = await createUserCart(userId, items);

    res.status(RESPONSE_CODE_CREATED).json({
      data: { cart, totalPrice: calculateTotalPrice(items) },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error creating user cart" },
    });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const { userId } = req.user as CurrentUser;
    const cart = await getUserCart(userId);

    res.status(RESPONSE_CODE_OK).json({
      data: { cart },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error getting user cart" },
    });
  }
}

export async function updateCart(req: Request, res: Response) {
  const { userId } = req.user as CurrentUser;
  const updatedCart = req.body;

  try {
    const cart = await updateUserCart(userId, updatedCart.items);

    res.status(RESPONSE_CODE_OK).json({
      data: { cart, totalPrice: calculateTotalPrice(updatedCart.items) },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error updating user cart" },
    });
  }
}

export async function deleteCart(req: Request, res: Response) {
  const { userId } = req.user as CurrentUser;

  try {
    const userCart = await Cart.findOne({
      user: userId,
      isDeleted: false,
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    userCart.isDeleted = true;

    await userCart.save();

    res.status(RESPONSE_CODE_OK).json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error deleting user cart" },
    });
  }
}
