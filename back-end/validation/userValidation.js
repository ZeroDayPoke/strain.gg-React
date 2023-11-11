// ./validation/userValidation.js

import Joi from 'joi';

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().pattern(/^(?:\+?[0-9]{1,3}\s?)?(?:\([0-9]{1,3}\)\s?)?[0-9]{1,3}(?:-?[0-9]{1,4}){1,2}$/).required(),
    favorites: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(user);
};

const validateUpdateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    phone: Joi.string().pattern(/^(?:\+?[0-9]{1,3}\s?)?(?:\([0-9]{1,3}\)\s?)?[0-9]{1,3}(?:-?[0-9]{1,4}){1,2}$/),
    favorites: Joi.array().items(Joi.string()),
  });

  return schema.validate(user);
};

export { validateUser, validateUpdateUser }
