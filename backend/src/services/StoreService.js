// StoreService.js

import Store from "../models/Store.js";
import Strain from "../models/Strain.js";
import { Op } from "sequelize";

class StoreService {
  async createStore(storeData, userId) {
    const store = await Store.create(storeData);
    return store;
  }

  async getAllStores(query) {
    let where = {};
    if (query) {
      const { name, location, phone, email, description } = query;

      if (name) {
        where.name = { [Op.like]: `%${name}%` };
      }
      if (location) {
        where.location = { [Op.like]: `%${location}%` };
      }
      if (phone) {
        where.phone = { [Op.like]: `%${phone}%` };
      }
      if (email) {
        where.email = { [Op.like]: `%${email}%` };
      }
      if (description) {
        where.description = { [Op.like]: `%${description}%` };
      }
    }
    return await Store.findAll({ where });
  }

  async getStoreById(id) {
    const store = await Store.findByPk(id);
    return store;
  }

  async updateStore(id, storeData) {
    const store = await Store.findByPk(id);
    if (!store) {
      throw new NotFoundError("Store not found");
    }

    await store.update(storeData);
    return store;
  }

  async deleteStore(id) {
    const store = await Store.findByPk(id);
    if (!store) {
      throw new NotFoundError("Store not found");
    }

    await store.destroy();
    return { message: "Store deleted" };
  }

  async addStrainToStore(storeId, strainId) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new NotFoundError("Store not found");
    }

    const strain = await Strain.findByPk(strainId);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }

    await store.addStrain(strain);
    return { message: "Strain associated with store" };
  }

  async removeStrainFromStore(storeId, strainId) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new NotFoundError("Store not found");
    }

    const strain = await Strain.findByPk(strainId);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }

    await store.removeStrain(strain);
    return { message: "Strain disassociated from store" };
  }
}

export default new StoreService();
