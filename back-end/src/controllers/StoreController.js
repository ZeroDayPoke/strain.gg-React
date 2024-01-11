// StoreController.js

import StoreService from "../services/StoreService.js";
import {
  validateStore,
  validateUpdateStore,
} from "../validation/storeValidation.js";
import { NotFoundError, ValidationError } from "../errors/index.js";

export async function createStore(req, res, next) {
  try {
    const { userId } = req.body;
    const { name, location, phone, email, description } = req.body;
    const storeData = {
      name,
      location,
      phone,
      email,
      description,
      image_filename: req.file ? req.file.filename : null,
    };
    const store = await StoreService.createStore(storeData, userId);
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
}

export async function getStores(req, res, next) {
  try {
    const stores = await StoreService.getAllStores();
    res.json(stores);
  } catch (error) {
    next(error);
  }
}

export async function getStoreById(req, res, next) {
  try {
    const store = await StoreService.getStoreById(req.params.id);
    if (!store) {
      throw new NotFoundError("Store not found");
    }
    res.json(store);
  } catch (error) {
    next(error);
  }
}

export async function updateStore(req, res, next) {
  try {
    const { error } = validateUpdateStore(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const storeId = req.params.id;
    const existingStore = await StoreService.getStoreById(storeId);
    if (!existingStore) {
      throw new NotFoundError("Store not found");
    }

    const storeData = {
      ...req.body,
      image_filename: req.file
        ? req.file.filename
        : existingStore.image_filename,
    };

    const store = await StoreService.updateStore(storeId, storeData);
    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
}

export async function deleteStore(req, res, next) {
  try {
    const response = await StoreService.deleteStore(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function addStrainToStore(req, res, next) {
  try {
    const response = await StoreService.addStrainToStore(
      req.params.storeId,
      req.params.strainId
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function removeStrainFromStore(req, res, next) {
  try {
    const response = await StoreService.removeStrainFromStore(
      req.params.storeId,
      req.params.strainId
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
