set foreign_key_checks = 0;

Create table Usuario(
    ID int NOT NULL auto_increment primary key,
    Nickname char(35) not null,
    Contraseña char(32) not null,
    Mail char(54) not null,
    Presupuesto float(3) not null,
    Transferencias int(1),
    Wildcard boolean
);

CREATE table Fecha(
    ID int not null auto_increment primary key,
    fecha date not null
);

CREATE table Jugador(
    ID INT NOT NULL auto_increment primary key,
    nombre char(15) not null,
    apellido char(20) not null,
    categoria char(3) NOT NULL,
    precio int not null
);

create table Equipo(
	ID INT not null auto_increment primary key,
    NombreEquipo varchar(75) not null,
	puntuacion int(4) not null,
  	alineacion JSON not null,
    ID_Usuario int not null,
    foreign key(ID_Usuario) references Usuario(ID)
);

CREATE table Estadistica(
    ID INT not NULL auto_increment primary key,
    ID_Fecha INT not null,
    ID_Jugador int not null,
    goles int not null,
    asistencias int not null,
    intercepciones int not null,
    atajadas int not null,
    penalesErrados int not null,
    penalesAtajado int not null,
    asistioAClase boolean not null,
    puntos int not null,
    foreign key(ID_Fecha) references Fecha(ID),
    foreign key(ID_Jugador) references Jugador(ID)
);

CREATE table Equipo_Fecha(
    ID_Equipo int not null,
    ID_Fecha int not null,
    primary key(ID_Equipo, ID_Fecha),
    foreign key(ID_Equipo) references Equipo(ID),
    foreign key(ID_Fecha) references Fecha(ID)
);

CREATE TABLE Equipo_Jugador(
    ID_Equipo INT NOT NULL,
    ID_Jugador INT NOT NULL,
    primary key(ID_Equipo, ID_Jugador),
    foreign key(ID_Equipo) references Equipo(ID),
    foreign key(ID_Jugador) references Jugador(ID)
);
