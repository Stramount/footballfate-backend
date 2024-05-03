// import from interface.prisma.js

export async function userController(req , res , next){
    console.log("Metodo Usado: " + req.method) // solo metodos GET y PATCH para el usuario
    console.log("Header usados: ")
    console.log(req.headers)
    console.log("URL usada " + req.url)
    console.log("Query usada: ")
    console.log(req.query)
    console.log("Parametros usado: ")
    console.log(req.params)
    console.log("Body de la request")
    console.log(req.body)

    res.send("aqui los usuarios")

}