const express = require("express")
const {db,authenticatedDatabase} = require("./model/database.js")
const {register, login,getSchedule,getuser,logOut,addSchedule,deletedSchedule,getJobsBYid, updated } = require("./controler/index.js")
const {verifyToken}  = require ("./midleware/index.js")
const cookieParser = require('cookie-parser')
const {refressToken} = require("./controler/refres_Token.js")
const dotenv =require("dotenv")
const cors = require('cors')
 
const app = express(); 
const hostname = 'localhost';
const port = 3001;

dotenv.config()
app.use  (express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors({credentials:true, origin:"http://localhost:3000"}))

async function main(){
    await authenticatedDatabase() 
} 
 


app.post("/api/register",register)
app.post ("/api/login", login)
app.delete ("/logout",logOut)
app.get ("/api/jobs",verifyToken, getSchedule)
app.post ("/api/new/jobs",verifyToken, addSchedule)
app.delete ("/api/deleted/:id",verifyToken, deletedSchedule)
app.get ("/api/user/:Username",verifyToken, getuser)
app.get("/api/getJobs/:id",verifyToken,getJobsBYid )
app.put("/api/getJobs/:id",verifyToken,updated)
app.get ("/token",refressToken)

main() 
app.listen(port,()=>{ 
    console.log(`server running at ${hostname}:${port}`)
})