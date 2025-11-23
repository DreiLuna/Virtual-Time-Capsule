export const userValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: "Email cannot be empty",
        },
        isString: {
            errorMessage: "Email must be a string",
        },
        isEmail: {
            errorMessage: "Invalid Email",
        }
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