create table Equipo(
	ID_Equipo INT not null auto_increment primary key,
    NombreEquipo varchar(75) not null,
	Puntuacion int(4) not null
);

Create table Usuario(
    ID_Usuario int NOT NULL auto_increment primary key,
    Nickname char(35) not null,
    ID_Equipo int not null,
    Contraseña char(32) not null,
    Mail char(54) not null,
    Presupuesto float(3) not null,
    foreign key(ID_Equipo) references Equipo(ID_Equipo)
);



CREATE index Index1 
on Usuario (ID_Usuario, Nickname, ID_Equipo, Contraseña, Mail, Presupuesto);

Create index Index2
on Equipo (ID_Equipo, NombreEquipo, Puntuacion);
