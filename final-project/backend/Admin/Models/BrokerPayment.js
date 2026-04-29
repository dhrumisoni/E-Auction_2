import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";
import Bid from "./Bid.js";

const BrokerPayment = sequelize.define(
  "BrokerPayment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    bid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "bids", key: "id" },
    },

    // Buyer (winner)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },

    final_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    commission_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    commission_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Pending", "Paid"),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "broker_payments",
    timestamps: false,
  }
);

// Associations
BrokerPayment.belongsTo(Bid, { foreignKey: "bid_id", as: "bid" });
Bid.hasMany(BrokerPayment, { foreignKey: "bid_id", as: "broker_payments" });

export default BrokerPayment;
