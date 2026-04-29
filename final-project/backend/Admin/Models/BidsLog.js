// Models/BidsLog.js
import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import User from "./User.js";
import Bid from "./Bid.js";

const BidsLog = sequelize.define("BidsLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bid_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "bids", key: "id" }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: "bids_logs",
  timestamps: false
});

// 🔗 Associations
BidsLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
BidsLog.belongsTo(Bid, { foreignKey: "bid_id", as: "bid" });

export default BidsLog;
