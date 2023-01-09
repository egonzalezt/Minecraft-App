const UserToken = require('../../schemas/userResetToken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

const generateResetToken = async (user) => {
    try {
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.SALTRECOVER));

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, resetToken: hash }).save();
        return Promise.resolve( resetToken );
    } catch (err) {
        return Promise.reject(err);
    }
};
module.exports= {
    generateResetToken,
};