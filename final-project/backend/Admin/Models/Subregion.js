import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import Region from "./Region.js";

const Subregion = sequelize.define("Subregion", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "regions", key: "id" },
  },
}, {
  tableName: "subregions",
  timestamps: false,
});

Subregion.belongsTo(Region, { foreignKey: "region_id", as: "region" });
Region.hasMany(Subregion, { foreignKey: "region_id", as: "subregions" });

export default Subregion;
