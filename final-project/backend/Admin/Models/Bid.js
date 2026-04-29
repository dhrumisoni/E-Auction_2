import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import User from "./User.js";
import Category from "./Category.js"; // ✅ new import

const Bid = sequelize.define("Bid", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: DataTypes.ENUM("Requested", "Active", "Rejected", "Ended"),
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  category_id: DataTypes.INTEGER,
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" }
  },
  image1_url: DataTypes.STRING,
  image2_url: DataTypes.STRING,
  image3_url: DataTypes.STRING,
  image4_url: DataTypes.STRING,
  price: DataTypes.FLOAT
}, {
  tableName: "bids",
  timestamps: false
});

// Association
Bid.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Bid, { foreignKey: "user_id", as: "bids" });

// ✅ Link Category
Bid.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Bid, { foreignKey: "category_id", as: "bids" });

export default Bid;
