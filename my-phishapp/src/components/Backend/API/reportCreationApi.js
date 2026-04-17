const express = require('express');
const router = express.Router();
const dbConfig = require("../db");
//================= REPORT APIs =================

// Endpoint to save campaign report
router.post('/save_report', async (req, res) => {
    const { campaign_id, email, clicked, submitted } = req.body;
    try {
        await dbConfig.execute(
            "INSERT INTO reports (campaign_id, email, clicked, submitted) VALUES (?, ?, ?, ?)",
            [campaign_id, email, clicked, submitted]
        );
        res.json({ success: true });
    } catch (err) {
        ``
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// Endpoint to fetch campaign reports
router.get('/reports', async (req, res) => {
    try {
        const [reports] = await dbConfig.execute(
            `select name,template_type,target_group,created_at from campaigns`
        );
        console.log(reports);
        res.json(reports);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});


// Clear all campaign reports
router.delete('/clear_reports', async (req, res) => {
    try {
        const sql = `DELETE FROM campaigns`;
        await dbConfig.execute(sql);
        res.json({ message: "All reports cleared successfully" });
    } catch (err) {
        console.error("Clear reports error:", err);
        res.status(500).json({ message: "Failed to clear reports" });
    }
});


module.exports = router;
