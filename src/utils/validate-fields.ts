import {IUser} from "../types/user-types";
export interface IValidationMapping<T> {
    [key: string]: {
        validationFn: (value: any) => boolean;
        error: string;
    };
}

const USERNAME_REGEXP = /^[A-Za-z]+$/;
const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userValidationMapping: IValidationMapping<IUser> = {
    name: {
        validationFn: (value: string) => !!value && USERNAME_REGEXP.test(value),
        error: 'Name should have only letters and be not empty',
    },
    email: {
        validationFn: (value: string) => EMAIL_REGEXP.test(value),
        error: 'Invalid email format.',
    },
};

const hobbiesValidationMapping: IValidationMapping<IUser> = {
    hobbies: {
        validationFn: (value: string[]):boolean =>
            Array.isArray(value)
            && value.length > 0
            && value.every((item: any) => typeof item === "string")
        ,
        error: 'Hobbies should contain only string values',
    },
}

const validateFields = <T>(validationMapping: IValidationMapping<T>, data: T): [string, string][] =>
    Object.entries(data as object).reduce(
        (errors: [string, string][], [key, value]) => {
            const { validationFn, error } = validationMapping[key];

            return !validationFn(value) ? [...errors, [key, error]] : errors;
        },
        []
    );

export const validateUserFields = validateFields.bind(null, userValidationMapping);
export const validateHobbies = validateFields.bind(null, hobbiesValidationMapping);
