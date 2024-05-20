import jwt from 'jsonwebtoken'

export default class Validator {

    static validationToken(req, res, next) {
        const { token } = req.cookies
        return next()

        jwt.verify(token, process.env.SECRET_TOKEN, (error, user) => {
            if (error)
                return res.status(400).json({ message: 'No autorizado, token no valido' })
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
}

