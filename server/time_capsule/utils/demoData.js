import { hashPassword } from "./helpers.js";

export const fakeUsers = [
  { id: 1, email: "user1@site.com", password: hashPassword("password123") },
  { id: 2, email: "user2@site.com", password: hashPassword("password321") },
  { id: 3, email: "user3@site.com", password: hashPassword("password1234") },
];
