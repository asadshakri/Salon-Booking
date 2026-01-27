const {DataTypes}=  require('sequelize');
const sequelize=require('../utils/db-connection');

const appointment=sequelize.define('appointment',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    customerName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    customerPhone:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    time:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    status:{
      type: DataTypes.STRING,
      defaultValue: "PENDING"
    },
    customerId:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    staffName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});


module.exports=appointment;
