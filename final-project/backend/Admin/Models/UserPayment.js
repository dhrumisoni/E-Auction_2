import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import User from "./User.js";
import Bid from "./Bid.js";

const UserPayment = sequelize.define("UserPayment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" }
  },
  bid_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "bids", key: "id" }
  },
  amount: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: "user_payments_for_bid",
  timestamps: false
});

// ✅ Associations
UserPayment.belongsTo(User, { foreignKey: "user_id", as: "user" });
UserPayment.belongsTo(Bid, { foreignKey: "bid_id", as: "bid" });
Bid.hasMany(UserPayment, { foreignKey: "bid_id", as: "payments" });

export default UserPayment;
