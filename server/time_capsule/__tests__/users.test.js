import * as validator from 'express-validator';
import { createUserHandler } from "../handlers/users.js";
import * as helpers from '../utils/helpers.js';

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "Invalid Username" }]),
    })),
    matchedData: jest.fn(()=> ({
        email: "test",
        password: "password",
    })),
}));

jest.mock('../utils.helper.js', () => ({
    hashPassword: jest.fn((password) => `hashed${password}`),
}));

describe('create users', () => {
    const mockRequest = {};
    const mockResponse = {
        sendStatus: jest.fn(),
        send: jest.fn(),
        status: jest.fn(() => mockResponse),
    }
    it('Return error when field is empty', async () => {
        await createUserHandler(mockRequest, mockResponse);
        expect(validator.validationResult).toHaveBeenCalled();
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Username" }])
    });

    // it('Return status of 201 when user is created'), async () => {
    //     jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
    //         isEmpty: jest.fn(() => true),
    //     }));
    //     await createUserHandler(mockRequest, mockResponse);
    //     expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    //     expect(helpers.hashPassword).toHaveBeenCalledWith("password");

    // }
});