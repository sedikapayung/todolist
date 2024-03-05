const {users} = require("../model/user.js")
const {schedule} = require("../model/schedule.js")
const bcrypt = require("bcrypt")
const jwt= require ("jsonwebtoken")

const getSchedule = async(req,res)=>{
 try {
  const user_id = req.user.userId
  const result= await schedule.findAll({
    where:{
      createdBy:user_id
    }
  },{
    attributes:['jobs','description', 'deadline']
  } 
  )
  if (result.length === 0){
    res.json ({msg:"THERE ARE NO JOBS AVAILABLE"})
  } else{
    res.status(200).json({data: result})
  }
 } catch (error) {
  console.log (error)
  res.status(500).json ({msg:"there error when getting data from daabase "})
 }
  
}
  const addSchedule = async(req,res)=>{
    try {
      const authHeader = req.headers['authorization'];
      console.log("authHeader:", authHeader); // Cetak nilai authHeader
      const token = authHeader && authHeader.split(' ')[1];
      console.log("token:", token); // Cetak nilai token
      if (token == null) return res.json({msg: "Token NULL"});
      const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECCRET)
      const userId = decoded.userId
      

      const {jobs,description,deadline}= req.body
      const newSchedule = await schedule.create({
        jobs:jobs,
        description:description,
        deadline:deadline,
        createdBy:userId
      })
      res.status(200).json({msg:"Add new schedule succesfully"})

    } catch (error) {
    console.log (error)
    res.status(500).json ({msg:"there error when getting data from daabase "})
    }
    
  }
const deletedSchedule = async (req,res)=>{
  try {
    const authHeader = req.headers['authorization'];
    console.log("authHeader:", authHeader); // Cetak nilai authHeader
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token:", token); // Cetak nilai token
    if (token == null) return res.json({msg: "Token NULL"});
    const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECCRET)
    const userId = decoded.userId

    const delSchedule = await schedule.destroy ({where:{id :req.params.id}})
    if (!delSchedule){
      return res.status (204).json({msg:'no data'})
    } else {
      res.status(200).json ({msg:"Data deleted successfully"})
    }
  } catch (error) {
    console.log(error)
  }
}

const getJobsBYid = async(req,res)=>{

  try {
    const authHeader = req.headers['authorization'];
      console.log("authHeader:", authHeader); // Cetak nilai authHeader
      const token = authHeader && authHeader.split(' ')[1];
      console.log("token:", token); // Cetak nilai token
      if (token == null) return res.json({msg: "Token NULL"});
      const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECCRET)
      const userId = decoded.userId
    const job = await schedule.findOne({where:{
      id : req.params.id
    }},{attributes:['jobs','description','deadline']
  }
  )
  if(!job){
    return res.status(404).json({msg:"Jobs Not Found"})
  }
  res.status(200).json({data:job})
  } catch (error) {
    console.log(error)
    res.status(500).json ({msg:'there error when getting job'})
  }
}

const getuser = async(req,res)=>{
  try {
   const result= await users.findOne({where:{
    Username : req.params.Username
   }
  })
  if (!result){
res.json ({msg:"User Not Found"})
  }
   else if (result.length === 0){
     res.json ({msg:"THERE ARE NO JOBS AVAILABLE"})
   } else{
     res.status(200).json({data: result})
   }
  } catch (error) {
   console.log (error)
   res.status(500).json ({msg:"there error when getting data from daabase "})
  }
   
 }


const updated = async(req,res)=>{
  try {
    const authHeader = req.headers['authorization'];
      console.log("authHeader:", authHeader); // Cetak nilai authHeader
      const token = authHeader && authHeader.split(' ')[1];
      console.log("token:", token); // Cetak nilai token
      if (token == null) return res.json({msg: "Token NULL"});
      const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECCRET)
      const userId = decoded.userId
      const {jobs,description,deadline} = req.body
      const data = await schedule.update({
        jobs: jobs,
        description: description,
        deadline:deadline
      },{
        where :{
          id : req.params.id
        }
      })
      res.status(200).json ({msg:'updated succsesfuly'})
  } catch (error) {
    res.status(500).json(error)
  }
}

const register = (req, res)=>{
  const {Username, Password, Name , confPassword}= req.body;
  const saltRounds= 10
  if (Password !== confPassword){
    return res.status(400).json({msg :"Password and confPassword not match"})
  }
  try {
    bcrypt.hash(Password,saltRounds,function (err, hashedPassword){
      if (err){
        console.log ("error while hased:", err);
        return res.status (500).json({msg:"error while hasfing password"})

      }
      users.create({Username:Username,
        Password:hashedPassword,
      Name:Name}).then(()=>{
        return res.status(200).json({msg:"Register Success"})
      }).catch((error)=>{
        console.error("Error during registration:", error);
        return res.status(500).json({ msg: "Internal server error" });
      })
    })
    
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}
const login = async (req, res) => {
  try {
    const user = await users.findOne({
      where :{
        Username : req.body.Username
      } 
      
    });
    if(!user) return res.status (404).json ({msg:"Username Not Found"})
    const match =  await bcrypt.compare(req.body.Password, user.Password);
    if (!match){
      return res.status (401).json ({msg:"wrong Password"})
    }
    
    const userId = user.id;
    const Username = user.Username;
    const Name = user.Name;
    const accesToken = jwt.sign({userId,Username,Name},process.env.ACCES_TOKEN_SECCRET,{
      expiresIn:'20s'
    });
    const refresToken =jwt.sign({userId,Username,Name},process.env.REFRES_TOKEN_SECCRET,{
      expiresIn:"1d"
    })
    await users.update({	refresToken: refresToken},{
      where:{
        id:userId
      } 
    });
    res.cookie('refressToken',refresToken,{httpOnly:true,maxAge: 24 * 60 * 60 *1000})
    res.json ({accesToken})
  } catch (error) {
    res.json({msg:error})
  }
}


const logOut = async (req,res)=>{
  try {
    const refressToken = req.cookies.refressToken
        if(!refressToken) return res.sendStatus (204);
        const user = await users.findOne({where:{
            refresToken:refressToken
        }})
        if (!user) return res.sendStatus(204);
        const userId = user.id;
        await users.update({refresToken:null},{where:{
          id:userId
        }})
        res.clearCookie('refressToken')
        return res.sendStatus(200)
  } catch (error) {
    console.log(error)
  }
}
module.exports={register, login,getSchedule,updated ,getuser,logOut,addSchedule, deletedSchedule,getJobsBYid }

