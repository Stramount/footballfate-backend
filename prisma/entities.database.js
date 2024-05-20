import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

const PRISMA = new PrismaClient()


export class Account {
  static prisma = PRISMA

  static async deleteAccount(req, res, next) {
    await prisma.usuario.delete({
      where: {
        ID: parseInt(req.params.id)
      }
    })

    return res.status(200).send("Usuario eliminado")
  }

  static async getAccount(req, res, next) {
    const user = await prisma.usuario.findFirst({
      where: {
        ID: req.body.id
      }
    })

    return res.json(user)
  }

  static async UpdateAccount(req, res, next) {
    const id = parseInt(req.params.id)
    const user = await prisma.usuario.update({
      where: {
        ID: id
      },
      data: {
        Nickname: req.body.username,
        Contrase_a: req.body.password,
        Mail: req.body.email,
        Equipo: {
          update: {
            where: {
              ID: id
            },
            data: {
              NombreEquipo: req.body.teamname
            }
          }
        }
      }
    })

    return res.json(user)
  }

  static async login(req, res, next) {
    const token = await Validator.createToken({ email: req.body.email })
    let { email, password } = req.body
    const user = await prisma.usuario.findFirst({
      where: {
        Mail: email,
        Contrase_a: password
      }
    })
    if (!user) { res.status(404); return res.send("Usuario no encontrado") }

    res.cookie('token', token)

    return res.json(user)
  }

  static async registerC(req, res) {
    const {
      username: Nickname,
      email: Mail,
      password: Contrase_a,
      teamname: NombreEquipo
    } = req.body
    try {
      const user = await prisma.usuario.create({
        data: {
          Mail,
          Nickname,
          Contrase_a,
          Presupuesto: 100.0,
          Equipo: {
            create: {
              NombreEquipo,
              Puntuacion: 10
            }
          }
        },
        include: {
          Equipo: {
            include: {
              Equipo_Jugador: {
                include: {
                  Jugador: true
                }
              }
            }
          }
        }
      })
      return res.json(user)
    } catch (e) {
      console.log(e)
      return res.status(500)
    }
  }

  static async loginC(req, res) {
    const {
      email: Mail
    } = req.body
    try {
      const user = await prisma.usuario.findFirst({
        where: {
          Mail
        },
        include: {
          Equipo: {
            include: {
              Equipo_Jugador: {
                include: {
                  Jugador: true
                }
              }
            }
          }
        }
      })
      return res.json({
        ...user,
        Equipo: {
          ...user.Equipo[0],
          Equipo_Jugador: undefined,
          Jugadores: user.Equipo[0].Equipo_Jugador.map(
            e => ({ ...e.Jugador, order: e.order, estaEnBanca: e.estaEnBanca, esCapitan: e.esCapitan })
          )
        }
      })
    } catch (e) {
      console.log(e)
      return res.status(500)
    }
  }

  static async postPlayers(req, res) {
    const {
      players: p
    } = req.body
    const players = await prisma.jugador.createMany({
      data: p
    })
    return res.json(players)
  }

  static async getPlayers(req, res) {
    const players = await prisma.jugador.findMany()
    return res.json(players)
  }

  static async register(req, res, next) {
    try {
      const token = await Validator.createToken({ email: req.body.email })
      console.log('token is generated')
      res.cookie('token', token)
      console.log('token:', token)
    } catch (e) {
      console.log(e)
      console.log('Hay un error')
    }

    const user = await prisma.usuario.create({
      data: {
        Nickname: req.body["username"],
        Contrase_a: req.body["password"],
        Mail: req.body["email"],
        Presupuesto: 100,
        Transferencias: 2,
        Wildcard: true,
        Equipo: {
          create: {
            NombreEquipo: req.body["teamname"],
            Puntuacion: 0,
            Alineacion: {
              create: {
                posgk: 0,
                pos1: 0,
                pos2: 0,
                pos3: 0,
                pos4: 0,
                pos5: 0,
                pos6: 0
              }
            },
            Banca: {
              create: {
                pos1: 0,
                pos2: 0
              }
            }
          }
        }
      }
    })

    return res.json(user)

  }
}

export class Team {
  static prisma = PRISMA

  static async getTeam(req, res, next) {
    const aux = await prisma.equipo.findUnique({
      where: {
        ID: req.params.id
      },
      select: {
        alineacion: true,
      }
    })
    const team = []
    for (i = 0; i < aux.alineacion.length; i++) {
      team.push(prisma.equipo)
    }
    // obtener el equipo que se pasa por ID
    // Realizar un ordenamiento de la alineacion para enviar al front
    return res.send(team)
  }

  static async transferPlayer(body, id) {
    if (!body.out?.["1"]) {
      return await Team.buyPlayer(body, id)
    }

    

    return "jugador transferido"

  }

  static async buyPlayer(body, id) {
    let aux = []
    for (id_jug = 0; id_jug < body.in.length; id_jug++) {
      aux.push(prisma.equipo_Jugador.update({
        where: {
          ID_Equipo_ID_Jugador: {
            ID_Equipo: id,
            ID_Jugador: body.in[`${id_jug}`]
          },
        },
        data: {
          ID_Jugador: body.in[`${id_jug}`],
          Equipo: {
            update: {
              Usuario: {
                update: {
                  Presupuesto: body.presupuesto
                }
              }
            }
          }
        }
      }))
    }
    Promise.all(aux)
    return "Jugador comprado"
  }


  static async updateTeam(req, res, next) {
    if (req.headers.transfer) {
      return res.send(await Team.transferPlayer(req.body, req.params.id))
    }

    const newTeam = await prisma.equipo.update({
      where: {
        ID: req.params.id
      },
      data: {
        NombreEquipo: req.body.teamname ?? Team.getTeam(req)["NombreEquipo"],
        Alineacion: req.body.lineup
      }
    })
    //editar tabla equipo
    //nombre o alineacion
    return res.send(newTeam)
  }

  static async createTeam(req, res, next) { // se usa para cuando hacemos la nueva semana
    // crea una copia del equipo
    // y lo asocia a la ultima fecha creada
    // se reinician los puntos a 0
    return res.send("Equipos Creados")
  }

  static async cambiarEquipo(req, res) {
    const id = parseInt(req.params.id)
    const { players } = req.body
    await prisma.$transaction(
      players.map(p =>
        prisma.equipo_Jugador.update({
          where: {
            ID_Equipo_ID_Jugador: {
              ID_Equipo: id,
              ID_Jugador: p.ID_Jugador
            }
          },
          data: {
            order: p.order,
            estaEnBanca: p.estaEnBanca,
            esCapitan: p.esCapitan
          }
        })
      )
    )
    return res.sendStatus(200)
  }

  static async transferenciaEquipo(req, res) {
    const id = parseInt(req.params.id) // recibis el id del equipo
    const { players } = req.body // recibis los nuevos jugadores
    const currentPlayers = (await prisma.equipo_Jugador.findMany({
      where: {
        ID_Equipo: id
      },
      include: {
        Jugador: true
      }
    })) // obtenes los jugadores actuales
    const costoRecuperado = currentPlayers.reduce((acum, cp) => {
      const jugadorEncontrado = players.find(p => p.ID_Jugador === cp.ID_Jugador)
      if (jugadorEncontrado)
        return acum
      return acum + cp.Jugador.precio
    }, 0) // obtenes el costo de los jugadores que vendiste
    const costoDeTransferencia = players.reduce((acum, p) => {
      const jugadorEncontrado = currentPlayers.find(cp => cp.ID_Jugador === p.ID_Jugador)
      if (jugadorEncontrado)
        return acum
      return acum + p.precio
    }, 0) // obtenes el costo de la transferencia
    await prisma.usuario.update({
      where: {
        ID: 2
      },
      data: {
        Presupuesto: {
          increment: costoRecuperado - costoDeTransferencia
        }
      }
    }) // acutalizas el presupuesto del usuario
    await prisma.equipo_Jugador.deleteMany({
      where: {
        ID_Equipo: id
      }
    }) // eliminas el equipo acutal
    await prisma.equipo_Jugador.createMany({
      data: players.map(p => ({ order: p.order, estaEnBanca: p.estaEnBanca, esCapitan: p.esCapitan, ID_Equipo: id, ID_Jugador: p.ID_Jugador })),
    }) // crear el nuevo equipo
    return res.sendStatus(200)
  }
}

export class Player {
  static prisma = PRISMA

  static players = {
    "testPlayer": {
      name: "testPlayer",
      team: "testTeam",
      stats: {
        goles: 0,
        asistencias: 0
      }
    }
  }

  static async getPlayers(req, res, next) {

    const players = await prisma.jugador.findMany({
      where: {
        nombre: {
          contains: req.params.name ?? ""
        }
      },
      include: {
        Estadistica: {
          select: {
            goles: true,
            asistencias: true,
            intercepciones: true,
            atajadas: true,
            penalesErrados: true,
            penalesAtajados: true,
            asistioAClase: true,
            puntos: true
          }
        }
      }
    })

    return res.json(players)

  }
}


export class Stat {

  static async createStat(req, res, next) {
    let helper = await prisma.fecha.findFirst({ select: { ID: true }, orderBy: { ID: 'desc' } })
    const newStat = await prisma.estadistica.create({
      data: {
        ID_Fecha: helper['ID'],
        ID_Jugador: parseInt(req.body.playerId),
        goles: parseInt(req.body.goals),
        asistencias: parseInt(req.body.assists),
        intercepciones: parseInt(req.body.interceptions),
        atajadas: parseInt(req.body.saves),
        penalesErrados: parseInt(req.body.failedPenalties),
        penalesAtajados: parseInt(req.body.savedPenalties),
        asistioAClase: Boolean(req.body.assistance),
        puntos: parseInt(req.body.points)
      }
    })
    return res.json(newStat)
  }
}