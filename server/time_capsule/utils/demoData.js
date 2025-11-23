import { hashPassword } from "./helpers.js";

export const fakeUsers = [
    { id: 1, username: 'user1', password: hashPassword('password123') },
    { id: 2, username: 'user2', password: hashPassword('password321') },
    { id: 3, username: 'user3', password: hashPassword('password1234') }
];