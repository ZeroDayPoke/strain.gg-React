// ./validation/storeValidation.js
import Joi from 'joi';

const validateStore = (store) => {
  const schema = Joi.object({
    name: Joi.string().max(128).required(),
    location: Joi.string().max(128).required(),
    operating_hours: Joi.array().items(Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
      open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    })).required(),
    image_filename: Joi.string().max(128),
    description: Joi.string(),
    phone: Joi.string().max(20),
    email: Joi.string().email(),
    facebook: Joi.string().max(128),
    instagram: Joi.string().max(128),
    average_rating: Joi.number().min(1).max(5),
  });

  return schema.validate(store);
};

const validateUpdateStore = (store) => {
  const schema = Joi.object({
    name: Joi.string().max(128),
    location: Joi.string().max(128),
    operating_hours: Joi.array().items(Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })),
    image_filename: Joi.string().max(128),
    description: Joi.string(),
    phone: Joi.string().max(20),
    email: Joi.string().email(),
    facebook: Joi.string().max(128),
    instagram: Joi.string().max(128),
    average_rating: Joi.number().min(1).max(5),
  });

  return schema.validate(store);
};
export { validateStore, validateUpdateStore }
