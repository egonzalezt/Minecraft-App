async function verifyContent(req,res,next)
{
    if (Object.keys(req.body).length === 0) {
        return res.status(406).json("Missing params")
    }else
    {
        return next();
    }
}
module.exports = verifyContent