const jwt = require('jsonwebtoken');
const {verifyRefreshToken} = require('../utils/verifyRefreshToken')
const findToken = require('../database/repositories/user/userFind')
async function renewAccessToken(req, res) {
    verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
        const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        res.status(200).json({
            error: false,
            accessToken,
            message: "Access token created successfully",
        });
    })
    .catch((err) => res.status(400).json(err));
}

async function deleteTokens(req, res) {
    try {
        const userToken = await findToken(req.body.refreshToken)
        if (!userToken)
            return res
                .status(200)
                .json({ error: false, message: "Logged Out Sucessfully" });

        await userToken.remove();
        res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    } catch (err) {
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

module.exports = {
    renewAccessToken,
    deleteTokens, 
};