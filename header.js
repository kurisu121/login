const { e } = require("./auth");

function header(req, pageTitle = "4BMarcos BSIS") {
    const currentPage = req.path.split("/").pop() || "index";
    const username = req.session?.UN || "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${e(pageTitle)}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar">
    <div class="nav-inner">
        <a class="brand" href="/home">4BMarcos <span>BSIS</span></a>

        <div class="user-box">
            Logged in as <strong>${e(username)}</strong>
        </div>

        <div class="nav-links">
            <a class="${currentPage === "home" ? "active" : ""}" href="/home">Dashboard</a>
            <a class="${currentPage === "course" ? "active" : ""}" href="/course">Course</a>
            <a class="${currentPage === "signup" ? "active" : ""}" href="/signup">Signup</a>
            <a class="${currentPage === "subjects" ? "active" : ""}" href="/subjects">Subjects</a>
        </div>

        <a class="logout" href="/logout">Logout</a>
    </div>
</nav>`;
}

module.exports = header;
