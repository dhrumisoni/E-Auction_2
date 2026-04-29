import { DataTypes } from "sequelize";
import db from "../Config/db.js";

const Bid = db.define("bids", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_date:{
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date:{
    type: DataTypes.DATE,
    allowNull: false
  },
  category_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image1_url:{
    type: DataTypes.STRING,
    allowNull: false
  },
  image2_url:{
    type: DataTypes.STRING,
    allowNull: false
  },
  image3_url:{
    type: DataTypes.STRING,
    allowNull: false
  },
  image4_url:{
    type: DataTypes.STRING,
    allowNull: false
  },
  price:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  docs:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false, 
  tableName: "bids"
})

export default Bid