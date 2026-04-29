import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import City from "./City.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  surname: DataTypes.STRING,
  number: DataTypes.BIGINT,
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  document_type: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM("Requested", "Approved", "Rejected"),
    defaultValue: "Requested",
  },
  password: DataTypes.STRING,
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "cities", key: "id" },
  },
}, {
  tableName: "users",
  timestamps: false,
});

User.belongsTo(City, { foreignKey: "city_id", as: "city" });
City.hasMany(User, { foreignKey: "city_id", as: "users" });

export default User;
