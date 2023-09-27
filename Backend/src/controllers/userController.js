const save = require('../database/repositories/user/userSave');
const findUser = require('../database/repositories/user/userFind')
const findUserById = require('../database/repositories/user/userFindId')
const { generateTokens } = require('../utils/generateToken');
const { generateWelcomeMailHtml } = require('../utils/mails/welcomeMail');
const restorePasswordMailHtml = require('../utils/mails/restorePassword');
const sendEmail = require('../email/sendEmail');
const bcrypt = require('bcrypt');
const { generateResetToken } = require('../database/repositories/resetToken/generateResetToken');
const findResetToken = require('../database/repositories/resetToken/tokenFind');
const userUpdatePassword = require('../database/repositories/user/userUpdatePassword');
const deleteResetToken = require('../database/repositories/resetToken/deleteResetToken');
const successPasswordResetMailHtml = require('../utils/mails/successPasswordReset');

const fetch = require('node-fetch');
const atob = require('atob');

const emailResetSubjects = {
    es: "Recuperación de cuenta",
    en: "Password Reset",
    jp: "パスワードリセット",
    fr: "Réinitialisation du mot de passe",
    ru: "Восстановление учетной записи"
};

const emailSuccessResetSubjects = {
    es: "Contraseña recuperada de forma exitosa",
    en: "Password successfully recovered.",
    jp: "パスワードが正常に回復しました。",
    fr: "Mot de passe récupéré avec succès.",
    ru: "Пароль успешно восстановлен."
};

const emailWelcomeSubjects = {
    es: "Bienvenido a arequipet",
    en: "Welcome to arequipet",
    jp: "アレキペットへようこそ",
    fr: "Bienvenue à arequipet",
    ru: "Добро пожаловать в arequipet"
};

async function registerUser(req, res) {
    const user = await findUser(req.body.email);
    const lang = req.headers['lang'] || 'es';
    const clientURL = process.env.BASEURL;
    if (user) {
        return res
            .status(400)
            .json({ error: true, message: "User with given email already exist" });
    } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const { email, nickName } = req.body
        await save(email, hashPassword, nickName).then((result) => {
            let html = generateWelcomeMailHtml(clientURL,nickName, lang);
            const subject = emailWelcomeSubjects[lang] || emailWelcomeSubjects.es;
            sendEmail(email, subject, html);
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
        userNickName: user.nickName,
        accessToken,
        refreshToken,
        message: "Logged in successfully",
    });
}

async function getUserInfo(req, res) {
    const idUser = req.body['usrId'];
    const user = await findUserById(idUser);
    if (user) {
        res.status(200).json({
            error: false,
            user: user,
            message: "user information provided successfully",
        });
    } else {
        return res
            .status(400)
            .json({ error: true, message: "No user found" });
    }
}

async function requestPasswordReset(req, res) {
    const email = req.body.email;
    const lang = req.body.lang;
    const user = await findUser(email);
    if (user) {
        const hash = await generateResetToken(user);
        const clientURL = process.env.BASEURL;
        const url = `${clientURL}passwordReset?token=${hash}&userid=${user._id}`
        const html = restorePasswordMailHtml(url, lang);
        const subject = emailResetSubjects[lang] || emailResetSubjects.es;
        sendEmail(email, subject, html).then((isMailSent) => {
            return res.status(201).json({ error: false, message: "Email sent successfully" });
        }).catch(() => {
            return res.status(500).json({ error: true, message: "Fail sending email" });
        })
    } else {
        return res
            .status(404)
            .json({ error: true, message: "No email associated with any user" });
    }
}

async function resetPassword(req, res) {
    const { token, userid, password, lang } = req.body;
    const resetToken = await findResetToken(userid);
    if (resetToken) {
        const isValid = await bcrypt.compare(token, resetToken.resetToken);
        if (!isValid) {
            return res
                .status(404)
                .json({ error: true, message: "Token Invalid" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await userUpdatePassword(userid, hashPassword);
        if (!newUser) {
            return res.status(400).json({ error: true, message: "Error something happens recovering your account" });
        }
        const isNewUserValid = await findUserById(userid);
        if (isNewUserValid) {
            await deleteResetToken(resetToken.resetToken);
            const html = successPasswordResetMailHtml(lang);
            const subject = emailSuccessResetSubjects[lang] || emailSuccessResetSubjects.es;
            sendEmail(isNewUserValid.email, subject, html);
            return res.status(201).json({ error: false, message: "Password updated successfully" });
        } else {
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    } else {
        return res
            .status(404)
            .json({ error: true, message: "No user or reset token found" });
    }
}


async function getSkin(req, res) {
    try {
        const playerName = req.body.nickName;
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
        const playerData = await response.json();

        const uuid = playerData.id;

        const profileResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
        const profileData = await profileResponse.json();

        const properties = profileData.properties[0].value;
        const decodedProperties = JSON.parse(atob(properties));
        const skinURL = decodedProperties.textures.SKIN.url;

        res.send({ error: false, skinURL, message: "Skin found" });
    } catch (error) {
        return res
            .status(404)
            .json({ error: true, message: "No Skin found" });
    }
}
module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    requestPasswordReset,
    resetPassword,
    getSkin
};