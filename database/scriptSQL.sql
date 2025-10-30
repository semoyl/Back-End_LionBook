-- ****************************************************************************************
-- Objetivo: Script SQL para criar e popular o banco de dados LionBook
-- Data: 30/10/2025
-- Autor: Sistema LionBook
-- Versão: 1.0
-- ****************************************************************************************

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS db_lionbooks;
USE db_lionbooks;

-- Criação das tabelas
CREATE TABLE IF NOT EXISTS tbl_usuario (
    id INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(45) NOT NULL,
    senha VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tipo_movimentacao (
    id INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_livro (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    data_publicacao DATE,
    quantidade INT,
    isbn VARCHAR(45),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_movimentacao (
    id INT NOT NULL AUTO_INCREMENT,
    id_movimentacao INT NOT NULL,
    id_usuario INT NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    id_livro INT NOT NULL,
    PRIMARY KEY (id),
    
    FOREIGN KEY (id_movimentacao) REFERENCES tipo_movimentacao(id),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id),
    FOREIGN KEY (id_livro) REFERENCES tbl_livro(id)
);

-- Inserção de dados iniciais

-- Tipos de movimentação
INSERT INTO tipo_movimentacao (tipo) VALUES 
('Entrada'),
('Saída');

-- Usuário padrão para testes
INSERT INTO tbl_usuario (login, senha) VALUES 
('admin', 'admin123'),
('bibliotecario', 'biblio123');

-- Livros de exemplo
INSERT INTO tbl_livro (titulo, data_publicacao, quantidade, isbn) VALUES 
('JavaScript: O Guia Definitivo', '2020-01-15', 10, '978-85-7522-594-8'),
('Python para Desenvolvedores', '2019-03-20', 8, '978-85-7522-123-4'),
('Estruturas de Dados e Algoritmos em Java', '2021-06-10', 5, '978-85-7522-789-0'),
('Banco de Dados: Projeto e Implementação', '2018-11-05', 12, '978-85-7522-456-1'),
('Engenharia de Software', '2020-08-22', 7, '978-85-7522-321-9'),
('Redes de Computadores', '2019-12-18', 6, '978-85-7522-654-0'),
('Sistemas Operacionais Modernos', '2021-04-30', 9, '978-85-7522-987-3'),
('Introdução à Programação Web', '2020-02-14', 15, '978-85-7522-234-5');
