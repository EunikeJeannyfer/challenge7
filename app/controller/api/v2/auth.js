const { PrismaClient } = require('@prisma/client')
const { encryptPassword, checkPassword } = 
    require('../../../../utils/auth')
const { JWTsign } = 
    require('../../../../utils/jwt')
const prisma = new PrismaClient();

module.exports = {
    async login(req, res){
        const {email, password} = req.body;

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if(!user){
            return res.status(404).json({
                status: "Fail!",
                message: "Email tidak ditemukan!"
            })
        }

        const isPasswordCorrect = await checkPassword(
            password, user.password
        )

        if(!isPasswordCorrect){
            return res.status(401).json({
                status: "Fail!",
                message: "Password Salah!"
            })
        }
        delete user.password 
        const token = await JWTsign(user)

        return res.status(201).json({
            status: "Success!",
            message: "Berhasil Login!",
            data: { user, token }
        })
    },
    async register(req, res){
        //coba buat fungsi register dengan menganti password 
        //dari req.body dengan password yang sudah terinkripsi

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

        const createUser = await prisma.user.create({
            data:{
                nama: req.body.nama,
                email: req.body.email,
                password: await encryptPassword(req.body.password),
                profile:{
                    create: {
                        identity_type: req.body.identity_type,
                        identity_number: req.body.identity_number,
                        address: req.body.address,
                    }
                }
            }
        })

        return res.status(201).json({
            status: "success",
            code: 200,
            message: 'Berhasil Register',
            data: createUser

        })
        
    },
    registerForm: async (req, res, next) => {
        try{
            const {email, password, nama} = req.body;
            console.log(req.body);
            const user = await prisma.user.findFirst({
                where: { email }
            })

            if(user){
                req.flash("error", "Email sudah terdaftar!")
                return res.redirect('/register')
            }

            const createUser = await prisma.user.create({
                data: {
                    email,
                    nama,
                    password: await encryptPassword(password)
                }
            });

            req.flash("success", "Berhasil Register!")
            return res.redirect('/login')
        }catch(e){
            next(e) // untuk mengirim error ke middleware dan ditampilkan di ejs
        }
    },
    async whoami(req, res){
        return res.status(200).json({
            status: "Success!",
            message: "OK",
            data: {
                user: req.user
            }
        })
    },
    authUser: async (email, password, done) =>{
        try {
            const user = await prisma.user.findUnique({
                    where: { email} 
            })
            if (!user || !await checkPassword(password, user.password)){
                return document(null, false, {message: 'Invvalid email or password'})
            }

            return done(null, user)
        } catch (err) {
            return done(null, false, { mesage: err.message})
        }
    },
    oauth: async (req, res) => {
        const token = await JWTsign({
            ...req.user,
            password: null
        })
        return res.status(201).json({
            status: "Success!",
            message: "Berhasil Login",
            data: { token }
        })
    }
    
}