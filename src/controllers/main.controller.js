import Database from "./database.controller";

class MainController{
    constructor(){
        this.database = new Database()
    }

    async sayHi(req , res){
        res.send("Hi from main controller")
    }
}

export default new MainController()