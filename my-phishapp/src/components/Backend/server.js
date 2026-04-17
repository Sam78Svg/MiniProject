// Messaging utilities
require('dotenv').config();

// server.js
const express = require('express');
const cors = require('cors');
const camCreationRoutes = require('./API/campaignCreationApi.js');
const sendCampaignRoutes = require('./API/sendCampaignApi.js');
const dbConfig = require('./db.js');
const reportCreationRoutes = require('./API/reportCreationApi.js');
const authRoutes = require('./API/authApi.js');


//MiddleWares
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Api Route
app.use("/api", camCreationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', reportCreationRoutes);
app.use('/api', sendCampaignRoutes);


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
});

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