const {DataTypes}= require("sequelize")
const {db} = require ("./database.js");

const schedule = db.define("schedule",{
    jobs : DataTypes.STRING,
    description : DataTypes.TEXT,
    deadline :DataTypes.DATE,
    createdBy: DataTypes.INTEGER
})

module.exports = {schedule}