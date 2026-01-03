// utils/messaging.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Configure nodemailer (replace with your SMTP details)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

// Configure Twilio (replace with your Twilio credentials)
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendEmail(recipients, link) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(','),
        subject: 'Phishing Simulation Link',
        text: `Please visit the following link: ${link}`
    };
    return transporter.sendMail(mailOptions);
}

async function sendSMS(recipients, link) {
    const results = [];
    for (const number of recipients) {
        try {
            const msg = await twilioClient.messages.create({
                body: `Please visit the following link: ${link}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: number
            });
            results.push(msg);
        } catch (err) {
            console.error(`Failed to send SMS to ${number}:`, err);
        }
    }
    return results;
}

module.exports = { sendEmail, sendSMS };