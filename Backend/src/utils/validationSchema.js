const Joi = require('joi');
const passwordComplexity= require('joi-password-complexity');

const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        nickName: Joi.string().required().label("Nick Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};

module.exports= {
    signUpBodyValidation,
    logInBodyValidation,
    refreshTokenBodyValidation,
};