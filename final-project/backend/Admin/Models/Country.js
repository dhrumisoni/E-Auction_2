import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import Subregion from "./Subregion.js";

const Country = sequelize.define("Country", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  subregion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "subregions", key: "id" },
  },
}, {
  tableName: "countries",
  timestamps: false,
});

Country.belongsTo(Subregion, { foreignKey: "subregion_id", as: "subregion" });
Subregion.hasMany(Country, { foreignKey: "subregion_id", as: "countries" });

export default Country;
