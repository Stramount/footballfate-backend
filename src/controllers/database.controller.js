// Importar cliente prisma
import { User, Account, Team, Player, Stat } from '../../prisma/entities.database.js'

export default class Database{
    constructor(){
        this.entities = {
            user: User,
            account: Account,
            team: Team,
            player: Player,
            stat: Stat
        }
    }
}