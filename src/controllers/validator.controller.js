import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export default class Validator {

    static async validationTokenRoutes(req, res, next) {
        const { token } = req.cookies.token ? req.cookies : req.headers 

        let result = Validator.validationToken(token)

        if (result instanceof Error)
            return res.status(401).json({ message: result.message })

        next()
    }

    static validationToken(token) {
        if (!token){
            return new Error('Token no dado')
        }

        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SECRET_TOKEN, (error, user) => {
                if (error)
                    reject(error)
                resolve(user)
            })
        })
    }

    static createToken(value) {
        return new Promise((resolve, reject) => {
            jwt.sign(value, process.env.SECRET_TOKEN, { expiresIn: '1d' },(error, token) => {
                if (error)
                    reject(error)
                resolve(token)
            })
        }) 
    }

    static validateSchema(schema) {
        return (req, res, next) => {
            try {
                schema.parse(req.body)
                next()
            } catch(e) {
                return res.status(400).json({ e })
            }
        }
    }

    static async hashPassword(password) {
        let salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash)
    }
}

