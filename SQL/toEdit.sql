/* paso a paso lo que hice para modificar 
la base de datos y que funcione con las nuevas tablas y relaciones */

/*
DROP TABLE Equipo_Fecha

ALTER TABLE Equipo
modify column Fecha_ID int not null;

ALTER TABLE Equipo
ADD FOREIGN KEY (Fecha_ID) REFERENCES Fecha(ID);


ALTER TABLE Equipo
ADD FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID) ON DELETE CASCADE;

DELETE FROM Usuario

ALTER TABLE Estadistica
DROP FOREIGN KEY Estadistica_ibfk_2;

ALTER TABLE Estadistica
DROP COLUMN ID_Jugador;

ALTER TABLE Estadistica
ADD COLUMN ID_Jugador int not null;

ALTER TABLE Estadistica
ADD FOREIGN KEY (ID_Jugador) REFERENCES Jugador(ID) ON DELETE CASCADE;

ALTER TABLE Equipo_Jugador
DROP FOREIGN KEY Equipo_Jugador_ibfk_1;

ALTER TABLE Equipo_Jugador
DROP FOREIGN KEY Equipo_Jugador_ibfk_2;

DROP TABLE Equipo_Jugador;

CREATE TABLE Equipo_Jugador(
    ID_Equipo int not null,
    ID_Jugador int not null,
    playerOrder int not null,
    esCapitan boolean not null,
    estaEnBanca boolean not null,
    PRIMARY KEY(ID_Equipo, ID_Jugador),
    FOREIGN KEY (ID_Equipo) REFERENCES Equipo(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_Jugador) REFERENCES Jugador(ID) ON DELETE CASCADE
);

delete from Fecha

insert into Fecha (fecha , estaCerrado)
values
    ("2024-06-04" , 0)

delete from Estadistica

delete from Jugador

INSERT INTO Jugador('nombre','apellido','categoria','precio')
values('Sebastian,'Moschen','PT',4.5),('Matias','Quinteros','PT',4.5),('Fabrizio','Galvez','PT',4.5),('Pietro','Elvireti','PT',4.5),('Facundo','Dimitrioff','DEF',4.5),
('Pietro','Elvireti','',),('Matias','Quinteros','',),('Sebastian','Moschen','',),('Marcos','Valentino','',),('Agustin','Jerez','',),('Tiziano','Ferro','',),
('Romeno','','',),('','','',),('','','',),('','','',),('','','',)

;*/