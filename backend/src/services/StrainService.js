// ./services/StrainService.js

import Strain from "../models/Strain.js";
import { User } from "../models/User.js";
import Store from "../models/Store.js";
import { Op } from "sequelize";

class StrainService {
  async createStrain(strainData, userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const strain = await Strain.create({
      ...strainData,
      cultivator_id: userId,
    });
    return strain;
  }

  async getAllStrains(query) {
    let where = {};
    if (query) {
      const {
        name,
        subtype,
        min_thc_concentration,
        min_cbd_concentration,
        date_added,
        grower,
        store,
      } = query;

      if (name) {
        where.name = name;
      }

      if (subtype) {
        where.subtype = subtype;
      }

      if (min_thc_concentration) {
        where.thc_concentration = { [Op.gte]: min_thc_concentration };
      }

      if (min_cbd_concentration) {
        where.cbd_concentration = { [Op.gte]: min_cbd_concentration };
      }

      if (date_added) {
        where.createdAt = { [Op.gte]: new Date(date_added) };
      }

      const strains = await Strain.findAll({
        where,
        include: [
          {
            model: User,
            as: "grower",
            where: grower ? { id: grower } : undefined,
            required: grower ? true : false,
          },
          {
            model: Store,
            where: store ? { id: store } : undefined,
            required: store ? true : false,
          },
        ],
      });

      return strains;
    }

    return await Strain.findAll();
  }

  async getStrainById(id) {
    const strain = await Strain.findByPk(id);
    return strain;
  }

  async updateStrain(id, strainData) {
    const strain = await Strain.findByPk(id);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }

    await strain.update(strainData);
    return strain;
  }

  async deleteStrain(id) {
    const strain = await Strain.findByPk(id);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }

    await strain.destroy();
    return { message: "Strain deleted" };
  }

  async addStoreToStrain(strainId, storeId) {
    const strain = await Strain.findByPk(strainId);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new NotFoundError("Store not found");
    }

    await strain.addStore(store);
    return { message: "Store associated with strain" };
  }

  async removeStoreFromStrain(strainId, storeId) {
    const strain = await Strain.findByPk(strainId);
    if (!strain) {
      throw new NotFoundError("Strain not found");
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new NotFoundError("Store not found");
    }

    await strain.removeStore(store);
    return { message: "Store disassociated from strain" };
  }
}

export default new StrainService();
