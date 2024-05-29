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

INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Sebastian', 'Moschen', 'PT', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Matias', 'Quinteros', 'PT', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Fabricio', 'Galvez', 'PT', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Pietro', 'Elviretti', 'PT', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Bauti', 'Gonzales', 'PT', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Facundo', 'Dimitroff', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Pietro', 'Elviretti', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Matias', 'Quinteros', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Sebastian', 'Moschen', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Marco', 'Valentino', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Agustin', 'Jerez', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Tiziano', 'Ferro', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Romeo', 'Dibello', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Tomas', 'Dular', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Bauti', 'Gonzales', 'DEF', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Tiziano', 'Ferro', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Tomas', 'Dular', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Nicolas', 'Rodriguez', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Lautaro', 'Chaparro', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Javier', 'Jimenez', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Fabricio', 'Galvez', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Bauti', 'Gonzales', 'MC', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Javier', 'Jimenez', 'DEL', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Marco', 'Valentino', 'DEL', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Lautaro', 'Chaparro', 'DEL', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Nicolas', 'Rodriguez', 'DEL', 4.5, 0);
INSERT INTO Jugador (nombre, apellido, categoria, precio, cantTransfer) VALUES ('Fabricio', 'Galvez', 'DEL', 4.5, 0);

alter table Jugador
ADD column cantTransfer int default 0
;*/