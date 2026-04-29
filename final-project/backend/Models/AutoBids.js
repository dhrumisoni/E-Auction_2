// backend/Models/AutoBid.js
import { DataTypes } from "sequelize";
import sequelize from "../Config/db.js"; // adjust path to your sequelize export

const AutoBid = sequelize.define("AutoBid", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  bid_id: { type: DataTypes.INTEGER, allowNull: false },
  max_bid: { type: DataTypes.INTEGER, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_bid_amount: { type: DataTypes.INTEGER, allowNull: true },
  min_increment: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "auto_bids",
  timestamps: false 
});

export default AutoBid;
