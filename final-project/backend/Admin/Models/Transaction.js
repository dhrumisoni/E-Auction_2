import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import User from "./User.js";
import Bid from "./Bid.js";

const Transaction = sequelize.define("Transaction", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bid_id: {
    type: DataTypes.INTEGER,
    references: { model: "bids", key: "id" }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: "users", key: "id" }
  },
  amount: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: "transactions",
  timestamps: false
});

Transaction.belongsTo(User, { foreignKey: "user_id", as: "user" });
Transaction.belongsTo(Bid, { foreignKey: "bid_id", as: "bid" });


export default Transaction;
