function logout(req, res) {
    req.session = null;
    res.redirect("/");
}

module.exports = logout;
