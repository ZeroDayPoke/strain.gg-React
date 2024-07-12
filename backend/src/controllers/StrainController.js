// ./controllers/StrainController.js

import StrainService from "../services/StrainService.js";
import {
  validateStrain,
  validateUpdateStrain,
} from "../validation/strainValidation.js";
import { NotFoundError, ValidationError } from "../errors/index.js";

export async function createStrain(req, res, next) {
  try {
    const { userId } = req.body;
    const { name, subtype, thc_concentration, cbd_concentration } = req.body;
    const strainData = {
      name,
      subtype,
      thc_concentration,
      cbd_concentration,
      image_filename: req.file ? req.file.filename : null,
    };
    const strain = await StrainService.createStrain(strainData, userId);
    res.status(201).json(strain);
  } catch (error) {
    next(error);
  }
}

export async function updateStrain(req, res, next) {
  try {
    const { error } = validateUpdateStrain(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const strainId = req.params.id;

    const existingStrain = await StrainService.getStrainById(strainId);
    if (!existingStrain) {
      throw new NotFoundError("Strain not found");
    }

    const strainData = {
      ...req.body,
      image_filename: req.file
        ? req.file.filename
        : existingStrain.image_filename,
    };

    const strain = await StrainService.updateStrain(strainId, strainData);
    res.status(200).json(strain);
  } catch (error) {
    next(error);
  }
}

export async function getStrains(req, res, next) {
  try {
    const strains = await StrainService.getAllStrains(req.query);
    res.status(200).json(strains);
  } catch (error) {
    next(error);
  }
}

export async function getStrainById(req, res, next) {
  try {
    const strain = await StrainService.getStrainById(req.params.id);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }
    res.json(strain);
  } catch (error) {
    next(error);
  }
}

export async function deleteStrain(req, res, next) {
  try {
    const response = await StrainService.deleteStrain(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function addStoreToStrain(req, res, next) {
  try {
    const response = await StrainService.addStoreToStrain(
      req.params.strainId,
      req.params.storeId
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function removeStoreFromStrain(req, res, next) {
  try {
    const response = await StrainService.removeStoreFromStrain(
      req.params.strainId,
      req.params.storeId
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
