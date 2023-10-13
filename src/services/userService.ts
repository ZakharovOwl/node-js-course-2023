import { v4 as uuidv4 } from "uuid";
import { User } from "../types/types";
import { db } from "../repositories/index";

export async function createUser(user: User): Promise<User> {
  try {
    const userId: string = uuidv4();
    const newUser: User = {
      ...user,
      id: userId,
    };
    await db.none("INSERT INTO users(id, username, email) VALUES($1, $2, $3)", [
      newUser.id,
      newUser.username,
      newUser.email,
    ]);

    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await db.any("SELECT * FROM users");
    return users;
  } catch (error) {
    throw new Error("Error fetching all users");
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await db.none("DELETE FROM users WHERE id = $1", userId);
  } catch (error) {
    throw new Error("Error deleting user");
  }
}
