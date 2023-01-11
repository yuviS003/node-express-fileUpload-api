const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "error", message: "files not found" });
    next()
}
module.exports = filesPayloadExists