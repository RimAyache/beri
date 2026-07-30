export interface IUser {
    id: number;
    email: string;
    role: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
}
