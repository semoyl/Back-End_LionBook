/****************************************************************************************
 * Objetivo: Model responsável pelo CRUD de dados referente a movimentações no banco de dados
 * Data: 30/10/2025
 * Autor: Sistema LionBook
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client para executar scripts no BD
const { PrismaClient } = require('@prisma/client')

//Instancia da Classe do prisma client, para gerar um objetto
const prisma =  new PrismaClient()

//Funcão para inserir no banco de dados uma nova movimentação
const insertMovimentacao = async function(movimentacao){
    try{
        let sql  = `insert into tbl_movimentacao(   
                                            id_movimentacao,
                                            id_usuario,
                                            quantidade,
                                            data_movimentacao,
                                            id_livro
                                        ) values (
                                            ${movimentacao.id_movimentacao},
                                            ${movimentacao.id_usuario},
                                            ${movimentacao.quantidade},
                                            '${movimentacao.data_movimentacao}',
                                            ${movimentacao.id_livro}
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

//Funcão para retornar do Banco de Dados uma lista de movimentações
const selectAllMovimentacao = async function(){
    try {
        //Script SQL para retornar os dados do banco com JOIN
        let sql = `SELECT 
                        m.id,
                        m.id_movimentacao,
                        tm.tipo as tipo_movimentacao,
                        m.id_usuario,
                        u.login as usuario,
                        m.quantidade,
                        m.data_movimentacao,
                        m.id_livro,
                        l.titulo as livro_titulo
                   FROM tbl_movimentacao m
                   INNER JOIN tipo_movimentacao tm ON m.id_movimentacao = tm.id
                   INNER JOIN tbl_usuario u ON m.id_usuario = u.id
                   INNER JOIN tbl_livro l ON m.id_livro = l.id
                   ORDER BY m.data_movimentacao DESC`

        //Executa o script SQL e aguarda o retorno dos dados
        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Funcão para buscar no banco de dados uma movimentação pelo ID
const selectByIDMovimentacao = async function(id){
    try {
        let sql = `SELECT 
                        m.id,
                        m.id_movimentacao,
                        tm.tipo as tipo_movimentacao,
                        m.id_usuario,
                        u.login as usuario,
                        m.quantidade,
                        m.data_movimentacao,
                        m.id_livro,
                        l.titulo as livro_titulo
                   FROM tbl_movimentacao m
                   INNER JOIN tipo_movimentacao tm ON m.id_movimentacao = tm.id
                   INNER JOIN tbl_usuario u ON m.id_usuario = u.id
                   INNER JOIN tbl_livro l ON m.id_livro = l.id
                   WHERE m.id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Funcão para buscar movimentações por livro
const selectByLivroMovimentacao = async function(id_livro){
    try {
        let sql = `SELECT 
                        m.id,
                        m.id_movimentacao,
                        tm.tipo as tipo_movimentacao,
                        m.id_usuario,
                        u.login as usuario,
                        m.quantidade,
                        m.data_movimentacao,
                        m.id_livro,
                        l.titulo as livro_titulo
                   FROM tbl_movimentacao m
                   INNER JOIN tipo_movimentacao tm ON m.id_movimentacao = tm.id
                   INNER JOIN tbl_usuario u ON m.id_usuario = u.id
                   INNER JOIN tbl_livro l ON m.id_livro = l.id
                   WHERE m.id_livro = ${id_livro}
                   ORDER BY m.data_movimentacao DESC`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Funcão para listar tipos de movimentação
const selectAllTipoMovimentacao = async function(){
    try {
        let sql = 'select * from tipo_movimentacao order by id'

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
    insertMovimentacao,
    selectAllMovimentacao,
    selectByIDMovimentacao,
    selectByLivroMovimentacao,
    selectAllTipoMovimentacao
}
