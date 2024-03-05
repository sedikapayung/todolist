const { DataTypes} = require("sequelize")
const {db} =  require("./database.js")
 

const users =  db.define('user',{
    Username: DataTypes.STRING,
    Password: DataTypes.STRING,
    Name : DataTypes.STRING,
    Avatar : DataTypes.STRING,
    refresToken:DataTypes.STRING
})
module.exports = {users}  