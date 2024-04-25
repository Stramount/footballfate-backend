import { server } from "./app";
import {router} from "../routes/path.routes"

server.use("/" , router)
server.listen(8000 , (...things) => {
    console.log(things)
})