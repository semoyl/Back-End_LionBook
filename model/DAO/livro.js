/****************************************************************************************
 * Objetivo: Model responsável pelo CRUD de dados referente a livros no banco de dados
 * Data: 30/10/2025
 * Autor: Gustavo Rocha
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client para executar scripts no BD
const { PrismaClient } = require('@prisma/client')

//Instancia da Classe do prisma client, para gerar um objetto
const prisma =  new PrismaClient()

//Funcão para inserir no banco de dados um novo livro
const insertLivro = async function(livro){
    try{
        let sql  = `insert into tbl_livro(   
                                            titulo,
                                            data_publicacao,
                                            quantidade,
                                            isbn
                                        ) values (
                                            '${livro.titulo}',
                                            '${livro.data_publicacao}',
                                            ${livro.quantidade},
                                            '${livro.isbn}'
                                        )`

        //Executa o Script SQL no BD e AGUARDA (AWAIT) o retorbo do BD
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch(error){
        console.log(error)
        return false
    }
}

//Funcão para atualizar no Banco de Dados um livro existente
const updateLivro = async function(livro){
    try {
        let sql = `update tbl_livro set      titulo           = '${livro.titulo}',
                                            data_publicacao  = '${livro.data_publicacao}',
                                            quantidade       = ${livro.quantidade},
                                            isbn             = '${livro.isbn}'
                                        where id        = ${livro.id} `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
        
    } catch (error) {
        console.log(error)
        return false
    }
}

//Funcão para excluir no Banco de Dados de um livro existente
const deleteLivro = async function(id){
    try {
        let sql = `delete from tbl_livro where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Funcão para retornar do Banco de Dados uma lista de livros
const selectAllLivro = async function(){
    try {
        //Script SQL para retornar os dados do banco
        let sql = 'select * from tbl_livro order by id desc'

        //Executa o script SQL e aguarda o retorno dos dados
        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Funcão para buscar no banco de dados um livro pelo ID
const selectByIDLivro = async function(id){
    try {
        let sql = `select * from tbl_livro where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Funcão para buscar livros por título (busca rápida)
const selectByTituloLivro = async function(titulo){
    try {
        let sql = `select * from tbl_livro where titulo like '%${titulo}%' order by titulo`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertLivro,
    updateLivro,
    deleteLivro,
    selectAllLivro,
    selectByIDLivro,
    selectByTituloLivro
}
