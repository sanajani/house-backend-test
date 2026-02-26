import joi from 'joi';

export const registerationSchemaValidation = joi.object({
    name: joi.string().min(2).max(60).required().messages({
        'string.min': 'Name should have a minimum length of 2',
        'string.max': 'Name should have a maximum length of 60',
        'any.required': 'Name is required'
    }),
    lastName: joi.string().min(2).max(60).messages({
        'string.min': 'Last Name should have a minimum length of 2',
        'string.max': 'Last Name should have a maximum length of 60',
    }),
    phoneNumber1: joi.string().required().messages({
        'any.required': 'Phone Number 1 is required'
    }),
    email: joi.string()
    .email({ tlds: { allow: false } })
    .allow(null, "")
    .optional()
    .messages({
      "string.email": "ایمیل معتبر وارد کنید",
    }),
    password: joi.string().min(2).required().messages({
        'string.min': 'Password should have a minimum length of 6',
        'any.required': 'Password is required'
    }),
}).options({ abortEarly: false , allowUnknown: true });


export const loginSchemaValidation = joi.object({
    phoneNumber1: joi.string().required().messages({
        'any.required': 'Phone Number 1 is required'
    }),
    password: joi.string().min(2).required().messages({
        'string.min': 'Password should have a minimum length of 6',
        'any.required': 'Password is required'
    }),
})
