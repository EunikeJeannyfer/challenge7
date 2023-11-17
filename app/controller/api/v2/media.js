const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const qr = require('node-qr-image');
const imagekit = require('../../../../utils/imagekit');
const users = require('./users');

const { encryptPassword } = 
    require('../../../../utils/auth')

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
    },
    qrcode: async (req, res) => {
        const { text } = req.body;

        const qrCode = qr.image(text, { type: 'png' });
        //ini ngasih tau kalau yg dikirim itu png nya, .pipe untuk mengambil urlnya td  
        res.setHeader("Content-Type", "image/png")
        qrCode.pipe(res);
    },
    imagekitUpload: async(req, res) => {
        try {
            // mengubah file menjadi string dengan encoding base64
            const stringFile = req.file.buffer.toString('base64'); 

            //process upload file ke imagekit
            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            })

            //mengembalikan response ke client
            return res.status(200).json({
                status: 'OK',
                message: 'Success',
                data: {
                    name: uploadFile.name,
                    url: uploadFile.url,
                    type: uploadFile.fileType
                }
            })
        } catch(err) {
            throw err;
        }
    },
    imagekitUpdate: async(req, res) => {
        try {

            if(!req.params.id) res.status(400).json({ 
                status: 'fail', 
                code: 400, 
                message: 'Bad Request! id is required',
            })

            // mengubah file menjadi string dengan encoding base64
            const stringFile = req.file.buffer.toString('base64'); 

            //process upload file ke imagekit
            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            })

            const update = await prisma.profile.update({
                where:{
                    id: Number (req.params.id)
                },
                data:{
                    picture: uploadFile.url
                }
            });

            const profile = await prisma.profile.findUnique({
                where:{
                    id: Number(req.params.id)
                }
            })
            
            const user = await prisma.user.findUnique({
                include: {
                    profile: true,
                },
                where:{
                    id: Number(profile.userId)
                }
            })

            //mengembalikan response ke client
            return res.status(200).json({
                status: 'OK',
                message: 'Success',
                data: [user, profile]
            })
        } catch(err) {
            throw err;
        }
    },
    registerWithPicture: async (req, res) => {
        try {
            const {email, password, nama} = req.body;
            const user = await prisma.user.findFirst({
                where: { email }
            })


            if(user){
                return res.status(404).json({
                    status: "Fail!",
                    message: "Email sudah terdaftar!"
                })
            }

            // mengubah file menjadi string dengan encoding base64
            const stringFile = req.file.buffer.toString('base64'); 

            //process upload file ke imagekit
            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            })
            
            const createUser = await prisma.user.create({
                data:{
                    nama: req.body.nama,
                    email: req.body.email,
                    password: await encryptPassword(req.body.password),
                    profile:{
                        create: {
                            identity_type: req.body.identity_type,
                            identity_number: parseInt(req.body.identity_number),
                            address: req.body.address,
                            picture: uploadFile.url
                        }
                    }
                }
            })
            
            console.log("4")
            return res.status(200).json({
                status: 'OK',
                message: 'Success',
                data: createUser 
            })
        } catch(err) {
            throw err;
        }
    },
    destroy: async (req, res) =>{
        
        if(!req.params.id) res.status(400).json({ 
            status: 'fail', 
            code: 400, 
            message: 'Bad Request! id is required',
        })

        const profil = await prisma.profile.update({
            where:{
                userId: Number (req.params.id)
            },
            data:{
                picture: null
            }
        })

        console.log(req.params.id)
        console.log(profil)

        console.log("a")
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Success Data terhapus!',
            data: profil
        })
    }
}