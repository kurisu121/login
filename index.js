const express = require("express");
const pool = require("./config");
const { e } = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
    if (req.session?.UN && req.session?.PW) {
        return res.redirect("/home");
    }

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | 4BMarcos BSIS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-body">
    <main class="login-card">
        <div class="login-brand">4BMarcos <span>BSIS</span></div>
        <span class="eyebrow">DATABASE MANAGEMENT SYSTEM</span>
        <h1>Welcome Back</h1>
        <p class="muted">Sign in to manage the BSIS records.</p>

        ${req.session?.loginError ? `<div class="alert error">${e(req.session.loginError)}</div>` : ""}

        <form method="post" autocomplete="off">
            <label for="UN">Username</label>
            <input type="text" id="UN" name="UN" required autofocus>

            <label for="PW">Password</label>
            <input type="password" id="PW" name="PW" required>

            <button class="primary full" type="submit">Login</button>
            <button class="primary full" type="submit">Signup</button>
        </form>

        <p class="login-note">Use the account included in the SQL database.</p>
    </main>
</body>
</html>`);

    if (req.session) delete req.session.loginError;
});

router.post("/", async (req, res) => {
    const username = String(req.body.UN || "").trim();
    const password = req.body.PW || "";

    if (username === "" || password === "") {
        req.session.loginError = "Please enter your username and password.";
        return res.redirect("/");
    }

    try {
        const [rows] = await pool.execute(
            "SELECT UN, PW FROM TBL_USERS WHERE UN = ? LIMIT 1",
            [username]
        );

        const user = rows[0];

        if (user) {
            const bcrypt = require("bcrypt");
            const valid = await bcrypt.compare(password, user.PW);

            if (valid) {
                req.session.UN = user.UN;
                req.session.PW = password;
                return res.redirect("/home");
            }
        }

        req.session.loginError = "Invalid username or password.";
        res.redirect("/");
    } catch (error) {
        req.session.loginError = "Invalid username or password.";
        res.redirect("/");
    }
});

module.exports = router;
