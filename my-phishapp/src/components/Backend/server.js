// Messaging utilities
const { sendEmail, sendSMS } = require('./utils/messaging');
require('dotenv').config();

// server.js
const express = require('express');
const cors = require('cors');
const dbConfig = require('./db.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import and use authentication routes
const authRoutes = require('./auth.js');
app.use('/api/auth', authRoutes);

// API endpoint to handle campaign creation and file upload
app.post('/api/save_campaign', async (req, res) => {
    console.log("BODY RECEIVED:", req.body);
    const { campaign_name, email_template, target_group } = req.body;

    if (!campaign_name || !email_template || !target_group) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Save campaign info and file path to MySQL
    try {
        const sql = `
            INSERT INTO campaigns (name, template_type, target_group, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        await dbConfig.execute(sql, [
            campaign_name,
            email_template,
            target_group,
        ]);
        res.json({ message: "Campaign saved successfully" });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Endpoint to send campaign link to emails or phone numbers
app.post('/api/send_campaign', async (req, res) => {
    const { mode, recipients, link } = req.body;
    console.log("MODE:", mode);
    console.log("RECIPIENTS:", recipients);
    console.log("LINK:", link);
    if (!mode || !recipients || !Array.isArray(recipients) || recipients.length === 0 || !link) {
        return res.status(400).json({ message: 'Mode, recipients, and link are required.' });
    }
    try {
        if (mode === 'sms') {
            await sendSMS(recipients, link);
        } else {
            await sendEmail(recipients, link);
        }
        res.json({ message: 'Campaign link sent successfully.' });
    } catch (err) {
        console.error('Send campaign error:', err);
        res.status(500).json({ message: 'Failed to send campaign link.' });
    }
});

app.get('/api/test-email', async (req, res) => {
    try {
        await sendEmail(
            ['kendresangamwaman@gmail.com'],
            'http://test-link.com'
        );
        res.send("Email sent");
    } catch (e) {
        console.error(e);
        res.status(500).send("Email failed");
    }
});


// Fetch campaign reports
app.get('/api/reports', async (req, res) => {
    try {
        const sql = `
            SELECT 
                name AS campaign_name,
                template_type AS email_template,
                target_group,
                created_at AS sent_date
            FROM campaigns
            ORDER BY created_at DESC
        `;

        const [rows] = await dbConfig.execute(sql);
        res.json(rows);
    } catch (err) {
        console.error("Report fetch error:", err);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

// Clear all campaign reports
app.delete('/api/clear_reports', async (req, res) => {
    try {
        const sql = `DELETE FROM campaigns`;
        await dbConfig.execute(sql);
        res.json({ message: "All reports cleared successfully" });
    } catch (err) {
        console.error("Clear reports error:", err);
        res.status(500).json({ message: "Failed to clear reports" });
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));