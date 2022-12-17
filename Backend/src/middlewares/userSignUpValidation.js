const {signUpBodyValidation} = require('../utils/validationSchema');

async function verifyContentSignUp(req,res,next)
{
    const { error } = signUpBodyValidation(req.body);
    if (error) {
        messages = error.details.map((message)=>{
            return message.message
        })
        return res
                .status(400)
                .json({ error: true, message: messages });
    }else
    {
        return next();
    }
}
module.exports= {
    verifyContentSignUp,
};