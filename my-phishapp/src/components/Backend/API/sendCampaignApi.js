const express = require('express');
const router = express.Router();
const dbConfig = require("../db");
const { sendEmail, sendSMS } = require('../utils/messaging');

// ================= CAMPAIGN SENDING API =================

// Endpoint to send campaign link to emails or phone numbers
router.post('/send_campaign', async (req, res) => {
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

router.get('/test-email', async (req, res) => {
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

router.get('/recipients', async (req, res) => {
    let { group, page = 1, limit = 5 } = req.query;

    console.log("FETCH RECIPIENTS:", { group, page, limit });

    // 🔥 Convert EVERYTHING to proper types
    page = parseInt(page);
    limit = parseInt(limit);

    if (!group) {
        return res.status(400).json({ message: "Group is required" });
    }

    if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({ message: "Invalid pagination values" });
    }

    const offset = (page - 1) * limit;

    try {
        const [count] = await dbConfig.execute(
            `SELECT COUNT(*) as total FROM users WHERE department = ?`,
            [group]
        );

        const query = `
            SELECT name, email 
            FROM users 
            WHERE department = ? 
            LIMIT ${limit} OFFSET ${offset}
        `;

        const [showData] = await dbConfig.execute(query, [group]);

        res.json({
            data: showData,
            total: count[0].total
        });

    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ message: "Failed to fetch recipients" });
    }
});

module.exports = router;