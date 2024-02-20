-- Criar o banco de dados
CREATE DATABASE CrudUsuario
-- Utilizar o banco de dados
USE DATABASE CrudUsuario
-- Criar a tabela de usuario
CREATE TABLE
	`Usuarios` (
		`ID` INT NOT NULL AUTO_INCREMENT,
		`Nome` VARCHAR(100) NULL DEFAULT NULL,
		`Cargo` VARCHAR(40) NULL DEFAULT NULL,
		`Senha` VARCHAR(100) NULL DEFAULT NULL,
		`Email` VARCHAR(100) NULL DEFAULT NULL,
		PRIMARY KEY (`ID`)
	) COLLATE = 'utf8mb4_0900_ai_ci';

-- Selecionar o usuario
SELECT
	*
FROM
	usuarios

	-- Inserir um novo usuário
INSERT INTO
	usuarios (Nome, Cargo, Senha, Email)
VALUES
	(
		'Andre Luiz Belmonte',
		'Analista de sistema junior',
		'And123',
		'belmonte_al@outlook.com'
	)