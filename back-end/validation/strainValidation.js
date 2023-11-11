// ./validation/strainValidation.js
import Joi from 'joi';

const validateStrain = (strain) => {
  const schema = Joi.object({
    terpene_profile: Joi.object().optional(),
    image_filename: Joi.string().max(128).optional(),
    name: Joi.string().max(128).required(),
    subtype: Joi.string().valid('Indica', 'Sativa', 'Hybrid', 'Unknown').optional(),
    thc_concentration: Joi.number().optional(),
    cbd_concentration: Joi.number().optional(),
  });

  return schema.validate(strain);
};

const validateUpdateStrain = (strain) => {
  const schema = Joi.object({
    terpene_profile: Joi.object(),
    image_filename: Joi.string().max(128),
    name: Joi.string().max(128),
    subtype: Joi.string().valid('Indica', 'Sativa', 'Hybrid', 'Unknown'),
    thc_concentration: Joi.number(),
    cbd_concentration: Joi.number(),
  });

  return schema.validate(strain);
};

export { validateStrain, validateUpdateStrain }
