-- CreateTable
CREATE TABLE `Equipo` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreEquipo` VARCHAR(75) NOT NULL,
    `Puntuacion` INTEGER NOT NULL,
    `ID_Usuario` INTEGER NOT NULL,

    INDEX `Equipo_ibfk_1`(`ID_Usuario`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nickname` CHAR(35) NOT NULL,
    `Contraseña` CHAR(32) NOT NULL,
    `Mail` CHAR(54) NOT NULL,
    `Presupuesto` FLOAT NOT NULL,
    `Transferencias` INTEGER NULL,
    `Wildcard` BOOLEAN NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipo_Fecha` (
    `ID_Equipo` INTEGER NOT NULL,
    `ID_Fecha` INTEGER NOT NULL,

    INDEX `ID_Fecha`(`ID_Fecha`),
    PRIMARY KEY (`ID_Equipo`, `ID_Fecha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estadistica` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_Fecha` INTEGER NOT NULL,
    `ID_Jugador` INTEGER NOT NULL,
    `goles` INTEGER NOT NULL,
    `asistencias` INTEGER NOT NULL,
    `intercepciones` INTEGER NOT NULL,
    `atajadas` INTEGER NOT NULL,
    `penalesErrados` INTEGER NOT NULL,
    `penalesAtajados` INTEGER NOT NULL,
    `asistioAClase` BOOLEAN NOT NULL,
    `puntos` INTEGER NOT NULL,

    INDEX `ID_Fecha`(`ID_Fecha`),
    INDEX `ID_Jugador`(`ID_Jugador`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fecha` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATE NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jugador` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` CHAR(15) NOT NULL,
    `apellido` CHAR(20) NOT NULL,
    `categoria` CHAR(3) NOT NULL,
    `precio` FLOAT NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipo_Jugador` (
    `ID_Equipo` INTEGER NOT NULL,
    `ID_Jugador` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `estaEnBanca` BOOLEAN NOT NULL,
    `esCapitan` BOOLEAN NOT NULL,

    INDEX `ID_Jugador`(`ID_Jugador`),
    PRIMARY KEY (`ID_Equipo`, `ID_Jugador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Equipo` ADD CONSTRAINT `Equipo_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `Usuario`(`ID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Equipo_Fecha` ADD CONSTRAINT `Equipo_Fecha_ibfk_1` FOREIGN KEY (`ID_Equipo`) REFERENCES `Equipo`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Equipo_Fecha` ADD CONSTRAINT `Equipo_Fecha_ibfk_2` FOREIGN KEY (`ID_Fecha`) REFERENCES `Fecha`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Estadistica` ADD CONSTRAINT `Estadistica_ibfk_1` FOREIGN KEY (`ID_Fecha`) REFERENCES `Fecha`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Estadistica` ADD CONSTRAINT `Estadistica_ibfk_2` FOREIGN KEY (`ID_Jugador`) REFERENCES `Jugador`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Equipo_Jugador` ADD CONSTRAINT `Equipo_Jugador_ibfk_1` FOREIGN KEY (`ID_Equipo`) REFERENCES `Equipo`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Equipo_Jugador` ADD CONSTRAINT `Equipo_Jugador_ibfk_2` FOREIGN KEY (`ID_Jugador`) REFERENCES `Jugador`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
