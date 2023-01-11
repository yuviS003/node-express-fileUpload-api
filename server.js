const express = require('express');
const fileUpload = require("express-fileupload")
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const filesPaylodExists = require('./middleware/filesPayloadExists')
const filesExtLimiter = require('./middleware/fileExtLimiter')
const fileSizeLimiter = require('./middleware/fileSizeLimiter')

const PORT = process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPaylodExists,
    filesExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files);
        console.log('heading', req.body.heading)
        console.log('subheading', req.body.subheading)
        Object.keys(files).forEach(key => {
            const filePath = path.join(__dirname, 'files', `${uuidv4()}_${files[key].name}`);
            files[key].mv(filePath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            });
        })
        return res.json({
            status: 'success', message: Object.keys(files).toString()
        })
    }
)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));