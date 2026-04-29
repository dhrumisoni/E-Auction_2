import { DataTypes } from "sequelize";
import db from "../../Config/db.js";

const AdminUser = db.define("admin_user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("Admin", "Manager", "Staff"),
    defaultValue: "Staff",
  },
}, {
  freezeTableName: true, // prevents plural table names
  timestamps: false,     // optional: disables createdAt/updatedAt
});

export default AdminUser;
