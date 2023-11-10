const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

module.exports = {
    uploadImage: async (req, res) => {
        console.log(req.file)
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                image_url: imageUrl
            }
        })
    },
    uploadDocument: async (req, res) => {
        const documentUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                document_url: documentUrl
            }
        })
    },
    uploadVideo: async (req, res) => {
        const videoUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                video_url: videoUrl
            }
        })
    }
}