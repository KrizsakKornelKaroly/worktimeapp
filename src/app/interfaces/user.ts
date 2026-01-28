export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    confirm?: string;
    role: string;
    secret: string;
    phone?: string;
    address?: string;
    description?: string;
    reg: Date;
    last?: Date;
    status: boolean;

}
