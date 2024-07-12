// ./models/Strain.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Strain = db.define(
  "Strain",
  {
    cultivator_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    terpene_profile: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    image_filename: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    subtype: {
      type: DataTypes.ENUM("Indica", "Sativa", "Hybrid", "Unknown"),
      allowNull: true,
    },
    thc_concentration: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cbd_concentration: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "Strains",
  }
);

Strain.associate = (models) => {
  Strain.belongsToMany(models.User, {
    as: "favorites",
    through: "user_favorites",
  });
  Strain.belongsToMany(models.Store, { through: "store_strains" });
  Strain.hasMany(models.Review, { foreignKey: "strain_id" });
  Strain.belongsTo(models.User, { as: "grower", foreignKey: "cultivator_id" });
};

export default Strain;
