const nodemailer = require('nodemailer')

function sendEmail(userEmail, subject, html) {
    const email = process.env.NODEEMAIL;
    const password = process.env.NODEPASSWORD;

    let MailTransporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: email,
            pass: password
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    let MailOptions = {
        from: email,
        to: userEmail,
        subject: subject,
        html: html
    }
    return new Promise((resolve, reject) => {
        MailTransporter.sendMail(MailOptions, (err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("Mail send successfully")
                resolve(true);
            }

        })
    });
}

module.exports = sendEmail