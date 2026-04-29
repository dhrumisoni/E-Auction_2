import { DataTypes } from "sequelize";
import db from "../Config/db.js";

const BidsLogs = db.define("bids_logs",{
  bid_id:{
    type: DataTypes.INTEGER,
    allowNull:false
  },
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false, 
  tableName: "bids_logs"
})

export default BidsLogs