//mengatur API user dan profile (1:1)

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = {
    //menampilkan user dan profilenya 
    async get(req, res){
        const { search, page = 1, limit = 10  } = req.query;
        console.log(req.query);
        let result = await prisma.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            include: {
                profile: true,
            },
            orderBy:{
                id: 'asc'
            }
        })
        
        if(!result.length) {
            return res.status(200).json({ 
                status: 'success', 
                code: 200, 
                message: 'Data Empty'
            })
        }

        return res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Success!',
            data: result
        })
    },
    async getById(req, res){
        //menampilkan user dan profilenya by ID
        if(!req.params.id) res.status(400).json({ 
            status: 'fail', 
            code: 400, 
            message: 'Bad Request! id is required',
        })
    
        const user = await prisma.user.findUnique({
            include: {
                profile: true,
            },
            where:{
                id: Number(req.params.id)
            }
        })
    
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Success!',
            data: user
        })
    },
    //menambahkan user dan profilenya 
    async create(req, res){
        const user = await prisma.user.create({ 
            data: { 
                nama: req.body.nama,
                email: req.body.email,
                password: req.body.password,
                profile:{
                    create: {
                        identity_type: req.body.identity_type,
                        identity_number: req.body.identity_number,
                        address: req.body.address,
                        createdBy: createdBy.name
                    }
                }
            }
        });

        res.status(201).json({ 
            status: 'success', 
            code: 200, 
            message: 'Data ditambahkan!',
            data: [user, profile]
        })
    },
    async update(req, res){
        const user = await prisma.user.update({
            where:{
                id: Number (req.params.id)
            },
            data: req.body
        });

        res.status(201).json({ 
            status: 'success', 
            code: 200, 
            message: 'Data diupdate!',
            data: user
        })
    },
    async destroy(req, res){
        
        if(!req.params.id) res.status(400).json({ 
            status: 'fail', 
            code: 400, 
            message: 'Bad Request! id is required',
        })
    
        const user = await prisma.user.delete({
            where:{
                id: Number(req.params.id)
            }
        })
    
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Success Data terhapus!',
        })
    }
}

