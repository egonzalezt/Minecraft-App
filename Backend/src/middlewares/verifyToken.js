const findUser = require('../database/repositories/user/userFindId')
const jwt= require('jsonwebtoken');

async function verifyToken(req,res,next)
{
    const token = req.headers["token"];
    if(!token) return res.status(403).json({error:true,message:"No token provided"})
    try{
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY)
        const user = await findUser(decoded._id)
        if(user){
            req.body['usrId']=decoded._id
            next();
        }else{
            return res.status(401).json({message:"Invalid token please login again"})
        }

    }
    catch{
        return res.status(401).json({message:"Invalid token"})
    }
}

module.exports = verifyToken