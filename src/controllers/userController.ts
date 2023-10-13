import { Request, Response } from "express";
import { EntityManager } from "@mikro-orm/core";
import { createUser, deleteUser, getAllUsers } from "../services/userService";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const em: EntityManager = (req as any).orm.em.fork();
    const user = await createUser(em, req.body);

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
    const em: EntityManager = (req as any).orm.em.fork();
    const users = await getAllUsers(em);

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
    const em: EntityManager = (req as any).orm.em.fork();
    await deleteUser(em, userId);

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
