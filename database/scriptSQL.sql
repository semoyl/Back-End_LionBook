-- ****************************************************************************************
-- Objetivo: Script SQL para criar e popular o banco de dados LionBook
-- Data: 30/10/2025
-- Autor: Gustavo Rocha
-- Versão: 1.0
-- ****************************************************************************************

CREATE DATABASE db_lionbooks;
USE db_lionbooks;

CREATE TABLE tbl_usuario (
    id INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(45) NOT NULL,
    senha VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE tipo_movimentacao (
    id INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE tbl_livro (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    data_publicacao DATE,
    quantidade INT, -- A quantidade atual em estoque
    isbn VARCHAR(45),
    PRIMARY KEY (id)
);


CREATE TABLE tbl_movimentacao (
    id INT NOT NULL AUTO_INCREMENT,
    id_movimentacao INT NOT NULL,  -- Chave estrangeira para o TIPO de movimentação (Entrada/Saída)
    id_usuario INT NOT NULL,       -- Chave estrangeira para o USUÁRIO que realizou a movimentação
    quantidade INT NOT NULL,       -- Quantidade de livros movimentados
    data_movimentacao DATE NOT NULL,
    id_livro INT NOT NULL,         -- Chave estrangeira para o LIVRO movimentado
    PRIMARY KEY (id),
    
    FOREIGN KEY (id_movimentacao) REFERENCES tipo_movimentacao(id),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id),
    FOREIGN KEY (id_livro) REFERENCES tbl_livro(id)
);


INSERT INTO tbl_usuario (login, senha) VALUES
('joao.admin', 'senha123'),
('maria.bibli', 'bibliotech'),
('pedro.estoque', 'est123');

INSERT INTO tipo_movimentacao (tipo) VALUES
('Entrada (Compra/Doação)'),
('Saída (Venda/Empréstimo)');

INSERT INTO tbl_livro (titulo, data_publicacao, quantidade, isbn) VALUES
('Dom Casmurro', '1899-01-01', 15, '978-8572328227'),
('1984', '1949-06-08', 22, '978-8535914849'),
('Cem Anos de Solidão', '1967-05-30', 10, '978-8501012651'),
('O Pequeno Príncipe', '1943-04-06', 35, '978-8595082161');

INSERT INTO tbl_movimentacao (id_movimentacao, id_usuario, quantidade, data_movimentacao, id_livro) VALUES
(1, 1, 5, '2025-10-25', 1),

(2, 2, 3, '2025-10-26', 2),

(1, 3, 10, '2025-10-29', 4);

SELECT * from tbl_usuario;
