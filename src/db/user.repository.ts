import {IExtendedUser, IUser} from "../types/user-types";
import {USERS_DB} from "./users-db";
const { v4: uuidv4 } = require('uuid');
let usersDB = USERS_DB;
export interface IUserRepository {
    create: (user: IUser) => IExtendedUser;
    getAllUsers(): IExtendedUser[];
    getOneByEmail: (email: string) => IExtendedUser | undefined;
    getOneById: (id: string) => IExtendedUser | undefined;
    updateOneById: (id: string, newData: IUser) => IExtendedUser | undefined;
    deleteOneById: (id: string) => void;
}

export class UserRepository implements IUserRepository {
    create (user: IUser){
        const newUser = {...user, id: uuidv4()};
        console.log('newUser', newUser)
        usersDB.push(newUser);
        return newUser;
    }

    getAllUsers(): IExtendedUser[] {
        return usersDB;
    }
    getOneByEmail(email: string): IExtendedUser | undefined{
        return this.getAllUsers().find(user => user.email === email)
    }

    getOneById(id: string){
        return this.getAllUsers().find(user => user.id === id)
    }

    updateOneById(id: string, newData: IUser) : IExtendedUser | undefined {
        const users = this.getAllUsers()
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1){
            return undefined
        }

        const newUser = {...users[userIndex], ...newData};
        users.splice(userIndex, 1, newUser);
        usersDB = users;
        return newUser;
    }

    deleteOneById(id: string): void{
        usersDB = this.getAllUsers().filter(user => user.id !== id)
    }
}

export const userRepository = new UserRepository();
