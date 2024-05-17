import Database from "./database.controller.js";
import Validator from "./validator.controller.js";

class MainController{
    constructor(){
        this.database = new Database()
        this.validator = Validator
    }

    async sayHi(req , res){
        res.send("Hi from main controller")
    }


}

export default new MainController()