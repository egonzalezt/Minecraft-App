const {refreshTokenBodyValidation} = require('../utils/validationSchema');

async function verifyRefreshToken(req,res,next){  
    const { error } = refreshTokenBodyValidation({"refreshToken":req.body["refreshToken"]});
    if (error) {
        return res
                .status(400)
                .json({ error: true, message: error.details[0].message });
    }else
    {
        return next();
    }
}
module.exports= {
    verifyRefreshToken,
};