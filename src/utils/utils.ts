import {IncomingMessage} from "http";
import {IExtendedUser, IUser} from "../types/user-types";

export type IHobbiesResponse = Pick<IUser, 'hobbies'>
export type IUserResponse = Omit<IUser, 'hobbies'>

export const makeUserDTO = (data: IUserResponse): Pick<IUser, 'name' | 'email'> => ({
    name: data.name,
    email: data.email,
});

export const makeUserUpdateDTO = (data: IUserResponse): Pick<IUser, 'name' | 'email'> => {
    const userDTO: {email?: string, name?: string} = {};
    // fast workaround to make the fields available for partial update
    if (data.email) {
        userDTO.email = data.email;
    }

    if (data.name) {
        userDTO.name = data.name;
    }
    return userDTO as Pick<IUser, 'name' | 'email'>
};

export const getRequestBody = async <T>(req: IncomingMessage): Promise<T> => {
    return await new Promise<T>((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (err) {
                console.error(err);
                reject(new Error('Invalid data format: expected JSON'));
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
};

export const shortenUser = (user: IExtendedUser): Omit<IExtendedUser, 'hobbies'> => {
    const {hobbies, ...rest} = user;
    return rest
}
