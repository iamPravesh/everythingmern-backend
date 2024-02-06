const mongoose = require('mongoose');

const Image = require('../models/image');

const fs = require('fs');
const path = require('path');
const { log } = require('console');

const IMAGEPATH = './public/images/';

const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const image = new Image({
            name: req.body.name,
            image: req.file.filename
        });
        await image.save();
        res.status(201).json(image);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        await Image.findByIdAndDelete(req.params.id);
        res.status(200).json({ 
            message: "Image deleted",
            image: image
        });
        fs.unlink(`${IMAGEPATH}${image.image}`, (err) => {
            if (err) {
                console.error("couldnot delete image: ", err);
                return;
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        const imageName = image.image;
        const imagePath = `${IMAGEPATH}${imageName}`;

        if(!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: "Image not found" });
        }

        const contentType = getContentTypes(imageName);
        res.set('content-type', contentType);

        const stream = fs.createReadStream(imagePath);

        stream.pipe(res);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

function getContentTypes(filename) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.jpeg':
        case '.jpg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}

module.exports = {
    getImages,
    uploadImage,
    deleteImage,
    getImage
};