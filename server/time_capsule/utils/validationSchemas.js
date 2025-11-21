export const userValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
        isString: {
            errorMessage: "Username must be a string",
        },
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "Username must be 5-32 characters",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty",
        },
        isString: {
            errorMessage: "Password must be a string",
        },
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "Password must be at least 8 characters",
        },
    },
};