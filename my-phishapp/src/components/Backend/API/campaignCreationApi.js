const express = require('express');
const router = express.Router();
const dbConfig = require("../db");
// ================= CAMPAIGN CREATION APIs =================

// API endpoint to handle campaign creation and 
router.post('/save_campaign', async (req, res) => {
    console.log("BODY RECEIVED:", req.body);
    const { campaign_name, email_template, target_group } = req.body;

    if (!campaign_name || !email_template || !target_group) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Save campaign info and file path to MySQL
    try {
        const sql = `
            INSERT INTO campaigns (name, template_type, target_group,created_at)
            VALUES (?, ?, ?,NOW())
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


// CREATE TEMPLATE
router.post('/templates', async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content)
        return res.json({ success: false, message: "All fields required" });

    try {
        await dbConfig.execute(
            "INSERT INTO templates (name, content) VALUES (?, ?)",
            [name, content]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// GET ALL TEMPLATES
router.get('/templates', async (req, res) => {
    try {
        const [templates] = await dbConfig.execute("SELECT * FROM templates");
        res.json(templates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// UPDATE TEMPLATE
router.put('/templates/:id', async (req, res) => {
    const { name, content } = req.body;
    const { id } = req.params;

    try {
        await dbConfig.execute(
            "UPDATE templates SET name=?, content=? WHERE id=?",
            [name, content, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// DELETE TEMPLATE
router.delete('/templates/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await dbConfig.execute("DELETE FROM templates WHERE id=?", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});


//load target groups for dropdown
router.get('/target-groups', async (req, res) => {
    try {
        const [rows] = await dbConfig.execute(
            `SELECT DISTINCT department FROM users`
        );

        const groups = rows.map(r => r.department);

        res.json(groups); // ✅ MUST be array

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch groups" });
    }
});

// Api endpoint to save links
router.post('/saveLink', async (req, res) => {
    const { link_desc, link_status, target_group, template_type } = req.body;
    if (!link_desc || !link_status || !target_group || !template_type) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const sql =
            "INSERT INTO links (link_desc, link_status, target_group,template_type) VALUES (?, ?, ?)"

        await dbConfig.execute(sql, [link_desc, link_status, target_group]);
        res.json({ message: "Link saved successfully" });
    }
    catch (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Database error" });
    }
});

router.get('/links', async (req, res) => {
    try {
        const [links] = await dbConfig.execute("SELECT * FROM links");
        res.json(links);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ message: "Database error" });
    }
});


module.exports = router;


