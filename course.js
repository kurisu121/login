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
            const course = String(req.body.course || "").trim();
            const description = String(req.body.description || "").trim();

            if (action === "save") {
                if (course === "" || description === "") {
                    error = "Course and description are required.";
                } else if (id > 0) {
                    await pool.execute(
                        "UPDATE TBL_COURSE SET COURSE = ?, DESCRIPTION = ? WHERE ID = ?",
                        [course, description, id]
                    );
                    message = "Course updated successfully.";
                } else {
                    try {
                        await pool.execute(
                            "INSERT INTO TBL_COURSE (COURSE, DESCRIPTION) VALUES (?, ?)",
                            [course, description]
                        );
                        message = "Course added successfully.";
                    } catch (err) {
                        error = err.errno === 1062 ? "That course already exists." : "Unable to add course.";
                    }
                }
            } else if (action === "delete" && id > 0) {
                await pool.execute("DELETE FROM TBL_COURSE WHERE ID = ?", [id]);
                message = "Course deleted successfully.";
            }
        }

        if (req.query.edit) {
            const id = Number(req.query.edit);
            const [rows] = await pool.execute(
                "SELECT ID, COURSE, DESCRIPTION FROM TBL_COURSE WHERE ID = ?",
                [id]
            );
            edit = rows[0] || null;
        }

        const [rows] = await pool.query("SELECT ID, COURSE, DESCRIPTION FROM TBL_COURSE ORDER BY ID");
        const pageTitle = "Course | 4BMarcos";

        const tableRows = rows.map(row => `
<tr>
    <td>${e(row.ID)}</td><td>${e(row.COURSE)}</td><td>${e(row.DESCRIPTION)}</td>
    <td class="actions"><a class="edit" href="/course?edit=${e(row.ID)}">Edit</a><form method="post" onsubmit="return confirm('Delete this course?');"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="${e(row.ID)}"><button class="danger" type="submit">Delete</button></form></td>
</tr>`).join("");

        res.send(`${header(req, pageTitle)}
<main class="container page">
    <div class="page-title"><span class="eyebrow">DATABASE FRONT END</span><h1>Course</h1><p>Add, edit, or delete course records.</p></div>
    ${message ? `<div class="alert success">${e(message)}</div>` : ""}
    ${error ? `<div class="alert error">${e(error)}</div>` : ""}

    <section class="panel form-panel">
        <h2>${edit ? "Edit Course" : "Add Course"}</h2>
        <form method="post" class="crud-form">
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" value="${e(edit?.ID || 0)}">
            <div><label>Course</label><input name="course" maxlength="20" required value="${e(edit?.COURSE || "")}"></div>
            <div><label>Description</label><input name="description" maxlength="150" required value="${e(edit?.DESCRIPTION || "")}"></div>
            <button class="primary" type="submit">${edit ? "Update Course" : "Add Course"}</button>
            ${edit ? `<a class="reset" href="/course">Cancel</a>` : ""}
        </form>
    </section>

    <section class="panel"><div class="table-wrap"><table><thead><tr><th>ID</th><th>COURSE</th><th>DESCRIPTION</th><th>Actions</th></tr></thead><tbody>${tableRows}</tbody></table></div></section>
</main>
${footer()}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
