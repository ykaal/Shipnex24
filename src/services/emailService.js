const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

exports.sendWelcomeEmail = async (email, name, dashboardLink) => {
    try {
        const info = await transporter.sendMail({
            from: '"ShipNex24" <notifications@shipnex24.com>',
            to: email,
            subject: 'Willkommen bei ShipNex24! Ihr Shop wird vorbereitet',
            text: `Hallo ${name}, vielen Dank für Ihren Kauf! ...` // simplified plain text
        });
        logger.info(`Welcome email sent to ${email}: ${info.messageId}`);
    } catch (error) {
        logger.error(`Error sending welcome email to ${email}`, error);
    }
};
