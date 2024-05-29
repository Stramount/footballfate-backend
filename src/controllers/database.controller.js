// Importar cliente prisma
import { Account, Team, Player, Stat } from '../../prisma/entities.database.js'

export default class Database{
    constructor(){
        this.entities = {
            account: Account,
            team: Team,
            player: Player,
            stat: Stat
        }
    }
}

