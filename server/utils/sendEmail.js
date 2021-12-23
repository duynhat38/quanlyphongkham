const nodemailer = require("nodemailer");
const config = require('./../config');

const sendEmail = async(email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: config.HOST,
            service: config.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: config.USER,
                pass: config.PASS,
            },
        });

        await transporter.sendMail({
            from: config.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;