const express= require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const IMAGEPATH = './public/images/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGEPATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const { getImages, uploadImage, deleteImage, getImage } = require('../controllers/imageController');

router.get('/', getImages);

router.post('/upload', upload.single('file'), uploadImage);

router.delete('/delete/:id', deleteImage);

router.get('/:id', getImage);

module.exports = router;