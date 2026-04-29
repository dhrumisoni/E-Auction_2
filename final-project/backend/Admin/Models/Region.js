import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";

const Region = sequelize.define("Region", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "regions",
  timestamps: false,
});

export default Region;
