
enum Role {
    USER,
    MANAGER,
    ADMIN
}

interface User {
    id: number;
    username: string;
    password: string;
    role: Role;
    preferredWorkingHours: number;
}

interface UserState {
    token: string;
    user: User;
}

export {Role};
export type { User, UserState };
