const {users} = require('../model/user.js')
const jwt = require("jsonwebtoken")

const refressToken = async (req, res)=>{
    try {
        const refressToken = req.cookies.refressToken
        if(!refressToken) return res.sendStatus (401);
        const user = await users.findOne({where:{
            refresToken:refressToken
        }})
        if (!user) return res.sendStatus(403);
        jwt.verify(refressToken,process.env.REFRES_TOKEN_SECCRET,(err, decoded)=>{
            if (err) return res.sendStatus(403);
            const userId = user.id
            const Name =user.Name
            const Username =user.Username
            const accesToken = jwt.sign({userId,Name,Username}, process.env.ACCES_TOKEN_SECCRET,{expiresIn:'20s'
            } )
            res.json ({accesToken})
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={refressToken}