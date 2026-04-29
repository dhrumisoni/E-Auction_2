import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import State from "./State.js";

const City = sequelize.define("City", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "states", key: "id" },
  },
}, {
  tableName: "cities",
  timestamps: false,
});

City.belongsTo(State, { foreignKey: "state_id", as: "state" });
State.hasMany(City, { foreignKey: "state_id", as: "cities" });

export default City;
