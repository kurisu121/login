function auth(req, res, next) {
    if (!req.session || !req.session.UN || !req.session.PW) {
        return res.redirect("/");
    }

    next();
}

function e(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function redirect(res, url) {
    return res.redirect(url);
}

module.exports = { auth, e, redirect };
