import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import Region from "./Region.js";
import Country from "./Country.js";

const State = sequelize.define("State", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "regions", key: "id" },
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "countries", key: "id" },
  },
}, {
  tableName: "states",
  timestamps: false,
});

State.belongsTo(Region, { foreignKey: "region_id", as: "region" });
State.belongsTo(Country, { foreignKey: "country_id", as: "country" });

Region.hasMany(State, { foreignKey: "region_id", as: "states" });
Country.hasMany(State, { foreignKey: "country_id", as: "states" });

export default State;
