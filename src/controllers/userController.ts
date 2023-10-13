import { Request, Response } from "express";
import { createUser, deleteUser, getAllUsers } from "../services/userService";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);

    res.status(RESPONSE_CODE_OK).json({
      data: user,
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error creating user" },
    });
  }
}

export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();

    res.status(RESPONSE_CODE_OK).json({
      data: users,
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error getting all users" },
    });
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    await deleteUser(userId);

    res.status(RESPONSE_CODE_OK).json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error deleting user" },
    });
  }
}
