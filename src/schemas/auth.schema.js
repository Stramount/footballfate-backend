import z from 'zod'

// const baseSchema = {
//     email: z.string({
//         required_error: 'El email es requerido'
//     }).email({
//         message: 'El email es invalido'
//     }),
//     password: z.string({
//         required_error: 'La contrasenia es requerida'
//     }).min(8, {
//         message: 'La contrasenia debe tener almenos 8 caracteres'
//     })
// }

// export const loginSchema = z.object({
//     ...baseSchema
// })

// export const registerSchema = z.object({
//     username: z.string({
//         required_error: 'El nombre de usuario es requerido'
//     }),
//     teamname: z.string({
//         required_error: 'El nombre del equipo es requerido'
//     }),
//     ...baseSchema
// })