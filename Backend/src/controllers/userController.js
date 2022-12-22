const save = require('../database/repositories/user/userSave');
const findUser = require('../database/repositories/user/userFind')
const findUserById = require('../database/repositories/user/userFindId')
const bcrypt = require('bcrypt');
const { generateTokens } = require('../utils/generateToken');

async function registerUser(req, res) {

    const user = await findUser(req.body.email);
    if (user) {
        return res
            .status(400)
            .json({ error: true, message: "User with given email already exist" });
    } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const { email, nickName } = req.body
        await save(email, hashPassword, nickName).then((result) => {
            return res.status(201).json({ error: false, message: "Account created successfully" });
        }).catch((err) => {
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        })
    }

}

async function loginUser(req, res) {
    let user = await findUser(req.body.email);
    if (!user)
        return res
            .status(400)
            .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!verifiedPassword) {
        return res
            .status(400)
            .json({ error: true, message: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    return res.status(200).json({
        error: false,
        userNickName:user.nickName,
        accessToken,
        refreshToken,
        message: "Logged in successfully",
    });
}

async function getUserInfo(req, res){
    const idUser = req.body['usrId'];
    const user = await findUserById(idUser);
    if(user){
        res.status(200).json({
            error: false,
            user: user,
            message: "user information provided successfully",
        }); 
    }else{

    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
};