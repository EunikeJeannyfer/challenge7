const express = require('express');
const router = express.Router();
const storage = require('../utils/multer')
const controller = require('../app/controller')
const multer = require('multer')();

//agar bisa dibuka imagenya
router.use('/images', express.static('public/images'));
router.use('/files', express.static('public/files'));

//('image') adalah key di postman
router.post('/v2/upload/image', 
        storage.image.single('image'),
        controller.media.uploadImage)
router.post('/v2/upload/video', 
        storage.video.single('video'),
        controller.media.uploadVideo)
router.post('/v2/upload/document', 
        storage.document.single('document'),
        controller.media.uploadDocument)


//QR-CODE
router.post('/v2/qrcode', controller.media.qrcode)

//imagekit
router.post('/v2/upload/imagekit',
        multer.single('image'),
        controller.media.imagekitUpload
)
module.exports = router;
