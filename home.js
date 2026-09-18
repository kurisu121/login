const express = require("express");
const { auth, e } = require("./auth");
const header = require("./header");
const footer = require("./footer");

const router = express.Router();

router.get("/", auth, (req, res) => {
    const pageTitle = "Dashboard | 4BMarcos";

    res.send(`${header(req, pageTitle)}
<main class="container home">
    <section class="hero">
        <span class="eyebrow">DATABASE MANAGEMENT SYSTEM</span>
        <h1>BSIS Information Portal</h1>
        <p>Welcome, <strong>${e(req.session.UN)}</strong>. Manage your course, year level, term, section, school year, and subject records below.</p>
    </section>

    <section class="module-grid">
        <a href="/course" class="module"><span>01</span><b>Course</b><small>View, add, edit, and delete courses</small></a>
        <a href="/schoolyear" class="module"><span>05</span><b>School Year</b><small>Manage school-year records</small></a>
        <a href="/subjects" class="module"><span>06</span><b>Subjects</b><small>Manage BSIS curriculum subjects</small></a>
    </section>
</main>
${footer()}`);
});

module.exports = router;
