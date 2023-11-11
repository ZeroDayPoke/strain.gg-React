// ./validation/reviewValidation.js
import Joi from 'joi';

const validateReview = (review) => {
  const schema = Joi.object({
    title: Joi.string().max(128).required(),
    content: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  });

  return schema.validate(review);
};

const validateUpdateReview = (review) => {
  const schema = Joi.object({
    title: Joi.string().max(128),
    content: Joi.string(),
    rating: Joi.number().min(1).max(5),
  });

  return schema.validate(review);
};

export { validateReview, validateUpdateReview }
