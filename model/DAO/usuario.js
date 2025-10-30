/****************************************************************************************
 * Objetivo: Model responsável pelo CRUD de dados referente a usuários no banco de dados
 * Data: 30/10/2025
 * Autor: Sistema LionBook
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client para executar scripts no BD
const { PrismaClient } = require('@prisma/client')

//Instancia da Classe do prisma client, para gerar um objetto
const prisma =  new PrismaClient()

//Funcão para inserir no banco de dados um novo usuário
const insertUsuario = async function(usuario){
    try{
        let sql  = `insert into tbl_usuario(   
                                            login,
                                            senha
                                        ) values (
                                            '${usuario.login}',
                                            '${usuario.senha}'
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

//Funcão para retornar do Banco de Dados uma lista de usuários
const selectAllUsuario = async function(){
    try {
        //Script SQL para retornar os dados do banco (sem mostrar a senha)
        let sql = 'select id, login from tbl_usuario order by id desc'

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

//Funcão para buscar no banco de dados um usuário pelo ID
const selectByIDUsuario = async function(id){
    try {
        let sql = `select id, login from tbl_usuario where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Funcão para autenticar usuário (login)
const authenticateUsuario = async function(login, senha){
    try {
        let sql = `select id, login from tbl_usuario where login = '${login}' and senha = '${senha}'`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result && result.length > 0)
            return result[0] // Retorna o primeiro usuário encontrado
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Funcão para verificar se login já existe
const checkLoginExists = async function(login){
    try {
        let sql = `select id from tbl_usuario where login = '${login}'`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result && result.length > 0)
            return true // Login já existe
        else
            return false // Login disponível
    } catch (error) {
        return false
    }
}

module.exports = {
    insertUsuario,
    selectAllUsuario,
    selectByIDUsuario,
    authenticateUsuario,
    checkLoginExists
}
