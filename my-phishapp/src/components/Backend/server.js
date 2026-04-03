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

// API endpoint to handle campaign creation and 
app.post('/api/save_campaign', async (req, res) => {
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

//load target groups for dropdown
app.get('/api/target-groups', async (req, res) => {
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
app.post('/api/saveLink', async (req, res) => {
    const { link_desc, link_status, target_group } = req.body;
    if (!link_desc || !link_status || !target_group) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const sql =
            "INSERT INTO links (link_desc, link_status, target_group) VALUES (?, ?, ?)"

        await dbConfig.execute(sql, [link_desc, link_status, target_group]);
        res.json({ message: "Link saved successfully" });
    }
    catch (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Database error" });
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

app.get('/api/recipients', async (req, res) => {
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

//================= REPORT APIs =================

// Endpoint to save campaign report
app.post('/api/save_report', async (req, res) => {
    const { campaign_id, email, clicked, submitted } = req.body;
    try {
        await dbConfig.execute(
            "INSERT INTO reports (campaign_id, email, clicked, submitted) VALUES (?, ?, ?, ?)",
            [campaign_id, email, clicked, submitted]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// Endpoint to fetch campaign reports
app.get('/api/reports', async (req, res) => {
    try {
        const [reports] = await dbConfig.execute(
            `select name as campaign_name, template_type as email_template,target_group as target_group, created_at as sent_date from campaigns`
        );
        res.json(reports);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
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

// ================= TEMPLATE APIs =================

// CREATE TEMPLATE
app.post('/api/templates', async (req, res) => {
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
app.get('/api/templates', async (req, res) => {
    try {
        const [templates] = await dbConfig.execute("SELECT * FROM templates");
        res.json(templates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// UPDATE TEMPLATE
app.put('/api/templates/:id', async (req, res) => {
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
app.delete('/api/templates/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await dbConfig.execute("DELETE FROM templates WHERE id=?", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "DB error" });
    }
});

// emloyee Data 
app.post('api/userExist', async (req, res) => {
    const [username] = req.body;
    try {
        const [getUser] = await dbConfig.execute('select name from users where name=?', [username]);
        res.status(200).json(success = true, getUser.name)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "db error" })
    }
})

//gemini api logic
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(message);
        const response = result.response.text();

        res.json({ reply: response });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ message: "AI error" });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));