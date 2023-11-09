// unit testing dgn jest 

const base = require('../app/controller/api/v2/tipeTransaksi')
const mockRequest = (body = {}, query = {}, params = {} ) => ({ body, query, params })
const mockResponse = () => {
    const res = {}
    res.json = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)

    return res
}

//get user test
describe("tipeTransaksi.get function", () => {
    test("res.json called with users data", async () => {
        const req = mockRequest()
        const res = mockResponse()
        await base.get(req, res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                status: 'success',
                code:200,
                message:"Success!",
                data: expect.any(Array)
                //return nya array bebas, ga harus ada isi 
            })
        )
    })

    //cek if
    test("res.json called with no result", async () => {
        const req = mockRequest({}, {
            page:3
        })
        const res = mockResponse()
        await base.get(req, res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                status: 'success',
                code:200,
                message:"Success!"
            })
        )
    })
})

describe("tipeTransaksi.getByID function", () => {
    test("res.json called with users data", async () => {
        const req = mockRequest({}, {
            params:1
        })
        const res = mockResponse()
        await base.get(req, res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                status: 'success',
                code:200,
                message:"Success!",
                data: expect.any(Array)
                //return nya array bebas, ga harus ada isi 
            })
        )
    })
})

describe("tipeTransaksi.destroy function", () => {
    test("res.json called with users data", async () => {
        const req = mockRequest({}, {
            params:13
        })
        const res = mockResponse()
        await base.get(req, res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                status: 'success',
                code:200,
                message:"Success!",
                data: expect.any(Array)
                //return nya array bebas, ga harus ada isi 
            })
        )
    })
})


describe("tipeTransaksi.create function", () => {
    test("res.json called with status 201", async () => {
        const req = mockRequest({
            nama_tipe: "test"
        })
        const res = mockResponse()
        await base.create(req, res)
        expect(res.status).toBeCalledWith(201)
        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                status: 'success',
                code:200,
                message:"Data ditambahkan!",
                data: expect.any(Object)
            })
        )
    })
})
