const express = require("express");
const pool = require("./config");
const { auth, e } = require("./auth");
const header = require("./header");
const footer = require("./footer");

const router = express.Router();

router.use(auth);

router.all("/", async (req, res) => {
    let message = "";
    let error = "";
    let edit = null;

    try {
        if (req.method === "POST") {
            const action = req.body.action || "";
            const id = Number(req.body.id || 0);

            if (action === "save") {
                const course = String(req.body.course || "").trim();
                const year = String(req.body.yearlevel || "").trim();
                const term = String(req.body.term || "").trim();
                const code = String(req.body.code || "").trim();
                const title = String(req.body.title || "").trim();
                const lecture = Number(req.body.lecture || 0);
                const laboratory = Number(req.body.laboratory || 0);
                const credit = Number(req.body.credit || 0);
                const gradeText = String(req.body.grade || "").trim();
                const grade = gradeText === "" ? null : Number(gradeText);
                const prerequisite = String(req.body.prerequisite || "").trim();

                if (!course || !year || !term || !code || !title || !prerequisite) {
                    error = "Please complete all required subject fields.";
                } else if (id > 0) {
                    try {
                        await pool.execute(
                            "UPDATE TBL_SUBJECT SET COURSE=?, YEARLEVEL=?, TERM=?, CODE=?, TITLE=?, LECTURE=?, LABORATORTY=?, CREDIT=?, GRADE=?, PRE_REQUISITE=? WHERE ID=?",
                            [course, year, term, code, title, lecture, laboratory, credit, grade, prerequisite, id]
                        );
                        message = "Subject updated successfully.";
                    } catch (err) {
                        error = err.errno === 1062 ? "That subject code already exists for this course." : "Unable to update subject.";
                    }
                } else {
                    try {
                        await pool.execute(
                            "INSERT INTO TBL_SUBJECT (COURSE, YEARLEVEL, TERM, CODE, TITLE, LECTURE, LABORATORTY, CREDIT, GRADE, PRE_REQUISITE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [course, year, term, code, title, lecture, laboratory, credit, grade, prerequisite]
                        );
                        message = "Subject added successfully.";
                    } catch (err) {
                        error = err.errno === 1062 ? "That subject code already exists for this course." : "Unable to add subject.";
                    }
                }
            } else if (action === "delete" && id > 0) {
                await pool.execute("DELETE FROM TBL_SUBJECT WHERE ID = ?", [id]);
                message = "Subject deleted successfully.";
            }
        }

        if (req.query.edit) {
            const id = Number(req.query.edit);
            const [rows] = await pool.execute("SELECT * FROM TBL_SUBJECT WHERE ID = ?", [id]);
            edit = rows[0] || null;
        }

        const year = String(req.query.year || "");
        const term = String(req.query.term || "");
        const where = [];
        const params = [];

        if (year !== "") {
            where.push("YEARLEVEL = ?");
            params.push(year);
        }
        if (term !== "") {
            where.push("TERM = ?");
            params.push(term);
        }

        let sql = "SELECT ID, COURSE, CODE, TITLE, YEARLEVEL, TERM, LECTURE, LABORATORTY, CREDIT, GRADE, PRE_REQUISITE FROM TBL_SUBJECT";
        if (where.length) sql += " WHERE " + where.join(" AND ");
        sql += " ORDER BY FIELD(YEARLEVEL,'1ST','2ND','3RD','4TH'), FIELD(TERM,'1ST SEM','2ND SEM','SUMMER','TUTORIAL'), CODE";

        const [rows] = await pool.execute(sql, params);
        const [courses] = await pool.query("SELECT COURSE, DESCRIPTION FROM TBL_COURSE ORDER BY ID");
        const [years] = await pool.query("SELECT YEARLEVEL, DESCRIPTION FROM TBL_YEARLEVEL ORDER BY ID");
        const [terms] = await pool.query("SELECT TERM, DESCRIPTION FROM TBL_TERM ORDER BY ID");

        const courseOptions = courses.map(c => `<option value="${e(c.COURSE)}" ${edit?.COURSE === c.COURSE ? "selected" : ""}>${e(c.COURSE + " - " + c.DESCRIPTION)}</option>`).join("");
        const yearOptions = years.map(y => `<option value="${e(y.YEARLEVEL)}" ${edit?.YEARLEVEL === y.YEARLEVEL ? "selected" : ""}>${e(y.DESCRIPTION)}</option>`).join("");
        const termOptions = terms.map(t => `<option value="${e(t.TERM)}" ${edit?.TERM === t.TERM ? "selected" : ""}>${e(t.DESCRIPTION)}</option>`).join("");
        const yearFilterOptions = years.map(y => `<option value="${e(y.YEARLEVEL)}" ${year === y.YEARLEVEL ? "selected" : ""}>${e(y.DESCRIPTION)}</option>`).join("");
        const termFilterOptions = terms.map(t => `<option value="${e(t.TERM)}" ${term === t.TERM ? "selected" : ""}>${e(t.DESCRIPTION)}</option>`).join("");

        const tableRows = rows.map(row => `
<tr>
    <td><b>${e(row.CODE)}</b></td><td class="wide">${e(row.TITLE)}</td><td>${e(row.COURSE)}</td><td>${e(row.YEARLEVEL)}</td><td>${e(row.TERM)}</td><td>${e(row.LECTURE)}</td><td>${e(row.LABORATORTY)}</td><td>${e(row.CREDIT)}</td><td>${row.GRADE === null ? "-" : e(row.GRADE)}</td><td>${e(row.PRE_REQUISITE)}</td>
    <td class="actions"><a class="edit" href="/subjects?edit=${e(row.ID)}">Edit</a><form method="post" onsubmit="return confirm('Delete this subject?');"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="${e(row.ID)}"><button class="danger" type="submit">Delete</button></form></td>
</tr>`).join("");

        res.send(`${header(req, "Subjects | 4BMarcos")}
<main class="container page">
    <div class="page-title"><span class="eyebrow">DATABASE FRONT END</span><h1>Subjects</h1><p>Add, edit, delete, and filter BSIS curriculum subjects.</p></div>
    ${message ? `<div class="alert success">${e(message)}</div>` : ""}
    ${error ? `<div class="alert error">${e(error)}</div>` : ""}

    <section class="panel form-panel">
        <h2>${edit ? "Edit Subject" : "Add Subject"}</h2>
        <form method="post" class="crud-grid">
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" value="${e(edit?.ID || 0)}">
            <div><label>Course</label><select name="course" required><option value="">Select Course</option>${courseOptions}</select></div>
            <div><label>Year Level</label><select name="yearlevel" required><option value="">Select Year</option>${yearOptions}</select></div>
            <div><label>Term</label><select name="term" required><option value="">Select Term</option>${termOptions}</select></div>
            <div><label>Code</label><input name="code" maxlength="30" required value="${e(edit?.CODE || "")}"></div>
            <div class="span-2"><label>Title</label><input name="title" maxlength="200" required value="${e(edit?.TITLE || "")}"></div>
            <div><label>Lecture</label><input type="number" step="0.1" min="0" name="lecture" required value="${e(edit?.LECTURE ?? "0")}"></div>
            <div><label>Laboratory</label><input type="number" step="0.1" min="0" name="laboratory" required value="${e(edit?.LABORATORTY ?? "0")}"></div>
            <div><label>Credit</label><input type="number" step="0.1" min="0" name="credit" required value="${e(edit?.CREDIT ?? "0")}"></div>
            <div><label>Grade <small>(optional)</small></label><input type="number" step="0.01" min="0" max="100" name="grade" value="${e(edit?.GRADE ?? "")}"></div>
            <div class="span-2"><label>Pre-Requisite</label><input name="prerequisite" maxlength="100" required value="${e(edit?.PRE_REQUISITE ?? "NONE")}"></div>
            <div class="form-actions"><button class="primary" type="submit">${edit ? "Update Subject" : "Add Subject"}</button>${edit ? `<a class="reset" href="/subjects">Cancel</a>` : ""}</div>
        </form>
    </section>

    <section class="panel">
        <form class="filters" method="get">
            <select name="year"><option value="">All Year Levels</option>${yearFilterOptions}</select>
            <select name="term"><option value="">All Terms</option>${termFilterOptions}</select>
            <button class="primary" type="submit">Filter</button><a class="reset" href="/subjects">Reset</a>
        </form>
        <div class="table-wrap"><table><thead><tr><th>Code</th><th>Title</th><th>Course</th><th>Year</th><th>Term</th><th>Lecture</th><th>Lab</th><th>Credit</th><th>Grade</th><th>Pre-Requisite</th><th>Actions</th></tr></thead><tbody>${tableRows}</tbody></table></div>
    </section>
</main>
${footer()}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
