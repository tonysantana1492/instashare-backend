export interface AuthResponseInterface {
    token: string;
    user: {
        id: number;
        username: string;
        displayname: string;
    }
}