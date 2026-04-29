import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "categories",
  timestamps: false,
});

export default Category;
