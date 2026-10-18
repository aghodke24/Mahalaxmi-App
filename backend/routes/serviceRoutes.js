const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ServiceBooking = require('../models/ServiceBooking');

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shrimahalaxmiappliances@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD || 'your-app-password-here' // Gmail App Password
    }
});

// POST save service booking & send email notification
router.post('/', async (req, res) => {
    try {
        const { customerName, phone, applianceType, address, userId } = req.body;

        // 1. Save entry to MongoDB
        const booking = await ServiceBooking.create({
            user: userId || null,
            customerName,
            phone,
            applianceType,
            address
        });

        // 2. Compose Email Content
        const mailOptions = {
            from: '"Shri Mahalaxmi Booking System" <shrimahalaxmiappliances@gmail.com>',
            to: 'shrimahalaxmiappliances@gmail.com',
            subject: `🚨 NEW SERVICE ENQUIRY: ${applianceType} - ${customerName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4a0e17; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #4a0e17; margin-top: 0;">New Doorstep Technician Service Booking Received</h2>
                    <p style="color: #555;">A new service enquiry has been placed on the website:</p>
                    <table style="width: 100%; text-align: left; border-collapse: collapse; margin-top: 15px;">
                        <tr style="background: #f8f8f8;"><th style="padding: 10px; border: 1px solid #ddd;">Appliance / Service</th><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${applianceType}</td></tr>
                        <tr><th style="padding: 10px; border: 1px solid #ddd;">Customer Name</th><td style="padding: 10px; border: 1px solid #ddd;">${customerName}</td></tr>
                        <tr style="background: #f8f8f8;"><th style="padding: 10px; border: 1px solid #ddd;">Phone Number</th><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #d97706;">${phone}</td></tr>
                        <tr><th style="padding: 10px; border: 1px solid #ddd;">Doorstep Address</th><td style="padding: 10px; border: 1px solid #ddd;">${address}</td></tr>
                        <tr style="background: #f8f8f8;"><th style="padding: 10px; border: 1px solid #ddd;">Inspection Fee</th><td style="padding: 10px; border: 1px solid #ddd;">₹299</td></tr>
                        <tr><th style="padding: 10px; border: 1px solid #ddd;">Booking ID</th><td style="padding: 10px; border: 1px solid #ddd;">${booking._id}</td></tr>
                    </table>
                    <br/>
                    <p style="font-size: 12px; color: #888;">Please contact the customer immediately to assign a technician.</p>
                </div>
            `
        };

        // 3. Send email asynchronously (won't fail booking if email credentials aren't set yet)
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Email send error:", err.message);
            } else {
                console.log("Service alert email sent successfully:", info.response);
            }
        });

        res.status(201).json({ message: "Service booked successfully & alert sent!", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;