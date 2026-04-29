import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import User from "./User.js";
import Bid from "./Bid.js";
import Transaction from "./Transaction.js";

const Winner = sequelize.define("Winner", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bid_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "bids", key: "id" },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "transactions", key: "id" },
  },
  
}, {
  tableName: "winners",
  timestamps: false,
});

// ✅ Relations
Winner.belongsTo(User, { foreignKey: "user_id", as: "user" });
Winner.belongsTo(Bid, { foreignKey: "bid_id", as: "bid" });
Winner.belongsTo(Transaction, { foreignKey: "transaction_id", as: "transaction" });

  
Transaction.hasOne(Winner, { foreignKey: "transaction_id", as: "winner" });

export default Winner;
