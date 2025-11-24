import { createUserHandler } from "../handlers/users.js";

jest.mock('express-validator', () => ({
    validationResult: jest.fn( () => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{msg: "Invalid Username"}]),
    })),
}));

describe('create users', () => {
    it('Return error when field is empty', async () => {
        const mockRequest = {};
        const mockResponse = {
            sendStatus: jest.fn(),
            send: jest.fn(),
            status: jest.fn( () => mockResponse),
        }
        await createUserHandler(mockRequest,mockResponse);
    })
});