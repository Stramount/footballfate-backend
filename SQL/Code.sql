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
	Puntuacion int(4) not null,
    ID_Usuario int not null,
    foreign key(ID_Usuario) references Usuario(ID)
);

CREATE table Alineacion(
    ID INT NOT NULL auto_increment primary key,
    ID_Equipo INT NOT NULL,
    posgk int not null,
    pos1 int not null,
    pos2 int not null,
    pos3 int not null,
    pos4 int not null,
    pos5 int not null,
    pos6 int not null,
    FOREIGN KEY(ID_Equipo) REFERENCES Equipo(ID)
);

CREATE table Banca(
    ID INT NOT NULL auto_increment primary key,
    ID_Equipo INT NOT NULL,
	pos1 int not null,
    pos2 int not NULL,
	 FOREIGN KEY(ID_Equipo) REFERENCES Equipo(ID)
);

CREATE table Estadistica(
    ID INT not NULL auto_increment primary key,
    ID_Fecha INT not null,
    ID_Jugador int not null,
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

create table Jugador_Alineacion(
    ID_Alineacion int not null,
    ID_Jugador int not NULL,
    primary key(ID_Alineacion, ID_Jugador),
    foreign key(ID_Alineacion) references Alineacion(ID),
    foreign key(ID_Jugador) references Jugador(ID)
);

create table Jugador_Banca(
    ID_Banca int not null,
    ID_Jugador int not NULL,
    primary key(ID_Banca, ID_Jugador),
    foreign key(ID_Banca) references Banca(ID),
    foreign key(ID_Jugador) references Jugador(ID)
);
