const nodemailer = require("nodemailer");
const config = require('./../config');

const sendEmail = async(email, subject, html) => {
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
            html: html
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = {
    forgot_password: async function(email, resetPasswordLink) {
        try {
            const html = `
            <p> Nhấp vào liên kết này để đặt lại mật khẩu mới cho tài khoản của bạn: ${email} </p>
            <a href="${resetPasswordLink}">
                Đặt lại mật khẩu mới
            </a>
            <p>Cảm ơn.</p>`
            await sendEmail(email, 'Đặt lại mật khẩu', html);
        } catch (error) {
            console.log(error)
        }
    },
    very_booking: async function(email, veryBookingLink, fullname, date, nameClinic, addressClinic) {
        try {
            const html = `
            <p> Xin chào: <b>${fullname}</b></p>
            <p> Thông tin đặt lịch khám chữa bệnh của bạn:</p>
            <p>Ngày: <b>${date}</b></p>
            <p>Tại phòng khám: <b>${nameClinic} - ${addressClinic}</b></p>
            <p> Nếu các thông tin trên là đúng sự thật vui lòng xác nhận lịch khám bằng cách click vào đường link : <a href="${veryBookingLink}">Xác nhận lịch khám</a></p>
            <p>Cảm ơn.</p>`
            await sendEmail(email, 'Xác nhận lịch khám', html);
        } catch (error) {
            console.log(error)
        }
    }
}