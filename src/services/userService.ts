// import { EntityManager } from "@mikro-orm/core";
// import { User } from "../entities/User";
//
// export async function createUser(em: EntityManager, user: User): Promise<User> {
//   try {
//     const newUser = new User(user.username, user.email);
//     em.persistAndFlush(newUser);
//
//     return newUser;
//   } catch (error) {
//     console.error("Error creating user:", error);
//     throw new Error("Error creating user");
//   }
// }
//
// export async function getAllUsers(em: EntityManager): Promise<User[]> {
//   try {
//     const users = await em.find(User, {});
//     return users;
//   } catch (error) {
//     console.error("Error fetching all users:", error);
//     throw new Error("Error fetching all users");
//   }
// }
//
// export async function deleteUser(
//   em: EntityManager,
//   userId: string,
// ): Promise<void> {
//   try {
//     const user = await em.findOne(User, { id: userId });
//     if (user) {
//       em.remove(user);
//       await em.flush();
//     } else {
//       throw new Error("User not found");
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     throw new Error("Error deleting user");
//   }
// }
