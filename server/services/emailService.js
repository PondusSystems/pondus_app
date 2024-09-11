const factoryUtils = require('../utils/factoryUtils');

const sendEmail = async (nodemailerConfig, to, subject, text, html) => {
    const transporter = factoryUtils.createTransporter(nodemailerConfig);
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            ...(text && { text }),
            ...(html && { html })
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email: ', error);
        const newError = new Error('Unable to send email!');
        newError.code = 500;
        throw newError;
    }
};

module.exports = { sendEmail };
