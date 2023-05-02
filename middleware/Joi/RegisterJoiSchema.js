const Joi=require("joi");

  
const RegisterJoiSchema=Joi.object({
email:Joi.string().email().required().messages({
    'string.base':"Email must be required",
    'string.empty': "Email must be required",
    'any.required': "Email must be required"
  }),
name:Joi.string().required().messages({
    'string.base':"Name must be required",
    'string.empty': "Name must be required",
    'any.required': "Name must be required"
  }),
phone:Joi.string().required().messages({
    'string.base':"Phone must be required",
    'string.empty': "Phone must be required",
    'any.required': "Phone must be required"
  }),
password:Joi.string()
.invalid('password', '123456', 'qwerty').min(3).max(20).required().messages({
    'string.base':"Password must be required",
    'any.invalid': 'Password  is not allowed keywords {#value}',
    'string.empty': "Password must be required",
    'string.min': "Password should have a minimum length of {#limit}",
     'string.max': "Password should have a maximum length of {#limit}",
    'any.required': "Password must be required"
  }),
});



module.exports = RegisterJoiSchema;