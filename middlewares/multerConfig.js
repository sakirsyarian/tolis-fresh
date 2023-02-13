const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },

    filename: function (req, file, cb) {
        const imageName = `${file.originalname.toLowerCase().split(' ').join('-')}`
        cb(null, imageName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const fiveMB = 1024 * 1024 * 5
const multerConfig = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: fiveMB
    }
})

module.exports = multerConfig