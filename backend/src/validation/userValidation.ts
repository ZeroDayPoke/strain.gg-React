// ./validation/userValidation.ts

import Joi from "joi";

interface UserInput {
  name: string;
  email: string;
  password: string;
  favorites?: string[];
  phone?: string;
}

interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  favorites?: string[];
  phone?: string;
}

const validateUser = (user: UserInput) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
  });

  return schema.validate(user);
};

const validateUpdateUser = (user: UserUpdateInput) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    phone: Joi.string().optional(),
  });

  return schema.validate(user);
};

export { validateUser, validateUpdateUser };
