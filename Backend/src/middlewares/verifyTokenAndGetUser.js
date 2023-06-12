const findUser = require('../database/repositories/user/userFindId')
const jwt= require('jsonwebtoken');

async function verifyTokenAndGetUser(req,res,next)
{
    let token = req.headers["authorization"];
    if(!token) return res.status(401).json({error:true,message:"No token provided"})
    try{
        token = token.split(' ')[1];
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY)
        const user = await findUser(decoded._id)
        if(user){
            return res.status(200).json({nickName: user.nickName,roles: user.roles, email: user.email})
        }else{
            return res.status(401).json({message:"Invalid token please login again"})
        }
    }
    catch{
        return res.status(401).json({message:"Invalid token"})
    }
}

module.exports = verifyTokenAndGetUser