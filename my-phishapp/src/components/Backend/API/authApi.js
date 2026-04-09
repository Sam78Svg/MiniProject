const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Signup endpoint (updated with employee password)
router.post('/signup', async (req, res) => {
    const { type } = req.body;

    try {
        // ================= EMPLOYEE =================
        if (type === "employee") {
            const { name, department, designation, email, joining_date, password } = req.body;

            if (!name || !email || !password)
                return res.json({ success: false, message: "Name, email & password required" });

            const [existing] = await db.execute(
                "SELECT employee_id FROM users WHERE email=?",
                [email]
            );

            if (existing.length > 0)
                return res.json({ success: false, message: "Employee already exists" });

            const hashed = await bcrypt.hash(password, 10);

            await db.execute(
                "INSERT INTO users (name, department, designation, email, joining_date, password) VALUES (?, ?, ?, ?, ?, ?)",
                [name, department, designation, email, joining_date, hashed]
            );

            return res.json({ success: true });
        }

        // ================= ADMIN =================
        if (type === "admin") {
            let { admin_id, username, company_name, role, email, password } = req.body;

            if (!admin_id || !username || !email || !password)
                return res.json({ success: false, message: "All admin fields required" });

            const usernameClean = username.trim().toLowerCase();

            const [existing] = await db.execute(
                "SELECT admin_id FROM admins WHERE admin_id=? OR email=?",
                [admin_id, email]
            );

            if (existing.length > 0)
                return res.json({ success: false, message: "Admin already exists" });

            const hashed = await bcrypt.hash(password, 10);

            await db.execute(
                "INSERT INTO admins (admin_id, username, company_name, role, email, password) VALUES (?, ?, ?, ?, ?, ?)",
                [admin_id, usernameClean, company_name, role, email, hashed]
            );

            return res.json({ success: true });
        }

        return res.json({ success: false, message: "Invalid type" });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Database error" });
    }
});

// Login endpoint (supports both employee & admin)
router.post('/login', async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password)
        return res.json({ success: false, message: "All fields required" });

    const usernameClean = username.trim().toLowerCase();

    try {
        // ===== try admin login =====
        const [admins] = await db.execute(
            "SELECT * FROM admins WHERE username=?",
            [usernameClean]
        );

        if (admins.length > 0) {
            const admin = admins[0];
            const match = await bcrypt.compare(password, admin.password);

            if (!match)
                return res.json({ success: false, message: "Invalid credentials" });

            return res.json({
                success: true,
                type: "admin",
                username: admin.username,
                role: admin.role
            });
        }

        // ===== try employee login (using email as username) =====
        const [employees] = await db.execute(
            "SELECT * FROM users WHERE name=?",
            [username]
        );

        if (employees.length === 0)
            return res.json({ success: false, message: "Invalid credentials" });

        const employee = employees[0];
        const match = await bcrypt.compare(password, employee.password);

        if (!match)
            return res.json({ success: false, message: "Invalid credentials" });

        res.json({
            success: true,
            type: "employee",
            name: employee.name,
            email: employee.email
        });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Database error" });
    }
});

module.exports = router;
