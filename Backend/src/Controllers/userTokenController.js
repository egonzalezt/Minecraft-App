const jwt = require('jsonwebtoken');
const { verifyRefreshToken } = require('../utils/verifyRefreshToken')
const findToken = require('../database/repositories/user/userTokenFind')
const removeToken = require('../database/repositories/user/userTokenRemove')
async function renewAccessToken(req, res) {
    verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails }) => {
            const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: "14m" }
            );
            return res.status(200).json({
                error: false,
                accessToken,
                message: "Access token created successfully",
            });
        })
        .catch((err) => res.status(400).json(err));
}

async function deleteTokens(req, res) {
    const refreshToken = req.headers["refreshtoken"]
    const userToken = await findToken(refreshToken)
    if (!userToken) {
        return res
            .status(200)
            .json({ error: false, message: "Logged Out Sucessfully" });
    }
    await removeToken(refreshToken);
    return res.status(200).json({ error: false, message: "Logged Out Sucessfully" });

}

module.exports = {
    renewAccessToken,
    deleteTokens,
};