 
const {Sequelize} = require("sequelize")

const db =  new Sequelize ("todo", "root", "",{
    host :"localhost",
    dialect:"mysql"
})
async function authenticatedDatabase (){
    try {
        await db.authenticate()
        console.log("Database Connected")
    } catch (error) {
        console.log (error)
    }
}

module.exports  = {db ,authenticatedDatabase}