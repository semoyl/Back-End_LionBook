/****************************************************************************************
 * Objetivo: Controller responsável pela regra de negócio do usuário (login e cadastro)
 * Data: 30/10/2025
 * Autor: Sistema LionBook
 * Versão: 1.0
 * **************************************************************************************/
//Import do arquivo de configuração para mensagens e status code
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar o CRUD no BD
const usuarioDAO = require('../../model/DAO/usuario.js')

//Função para inserir um novo usuário (para uso via Postman)
const inserirUsuario = async function(usuario, contentType){ 
try {
        if(contentType == 'application/json'){
            if(
                usuario.login    == undefined   ||   usuario.login    == ''   || usuario.login     == null     ||  usuario.login.length     > 45 ||
                usuario.senha    == undefined   ||   usuario.senha    == ''   || usuario.senha     == null     ||  usuario.senha.length     > 45
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                //Verificar se o login já existe
                let loginExists = await usuarioDAO.checkLoginExists(usuario.login)
                
                if(loginExists) {
                    return {status: false, status_code: 400, message: "Login já existe! Escolha outro login."}
                }

                //Encaminha os dados do novo usuário para ser inserido no BD
                let resultUsuario = await usuarioDAO.insertUsuario(usuario)

                if(resultUsuario)
                    return MESSAGE.SUCCESS_CREATED_ITEM //201
                else
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        } 
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para autenticar usuário (RF005 - Autenticar usuário)
const autenticarUsuario = async function(dadosLogin, contentType){ 
try {
        if(contentType == 'application/json'){
            if(
                dadosLogin.login    == undefined   ||   dadosLogin.login    == ''   || dadosLogin.login     == null ||
                dadosLogin.senha    == undefined   ||   dadosLogin.senha    == ''   || dadosLogin.senha     == null
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                //Chama a função para autenticar o usuário
                let resultUsuario = await usuarioDAO.authenticateUsuario(dadosLogin.login, dadosLogin.senha)

                if(resultUsuario){
                    //Usuário autenticado com sucesso
                    let dadosUsuario = {
                        status: true,
                        status_code: 200,
                        message: "Login realizado com sucesso!",
                        usuario: {
                            id: resultUsuario.id,
                            login: resultUsuario.login
                        }
                    }
                    return dadosUsuario //200
                }else{
                    return {status: false, status_code: 401, message: "Login ou senha inválidos!"} //401 Unauthorized
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        } 
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para retornar todos os usuários (sem mostrar senhas)
const listarUsuario = async function(){ 
    try {
        let dadosUsuarios = {}

        //Chama a função para retornar os dados dos usuários
        let resultUsuario = await usuarioDAO.selectAllUsuario()

        if(resultUsuario != false || typeof(resultUsuario) == 'object'){
            if(resultUsuario.length > 0){

                //Cria um objeto do tipo JSON para retornar a lista de usuários
                dadosUsuarios.status = true
                dadosUsuarios.status_code = 200
                dadosUsuarios.items = resultUsuario.length
                dadosUsuarios.usuarios = resultUsuario

                return dadosUsuarios //200
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }

    } catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para buscar um usuário pelo ID
const buscarUsuario = async function(id){
        try {

                let dadosUsuarios = {}
                if(
                    id          == ""            || 
                    id          == undefined     || 
                    id          == null          ||
                    isNaN(id)                    ||
                    id          <= 0   
                ){
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                }else{
                    //Chama a função para retornar os dados do usuário
                    let resultUsuario = await usuarioDAO.selectByIDUsuario(parseInt(id))

                    if(resultUsuario != false || typeof(resultUsuario) == 'object'){
                        if(resultUsuario.length > 0){

                            //Cria um objeto do tipo JSON para retornar o usuário
                            dadosUsuarios.status = true
                            dadosUsuarios.status_code = 200
                            dadosUsuarios.usuario = resultUsuario

                            return dadosUsuarios //200
                        }else{
                            return MESSAGE.ERROR_NOT_FOUND //404
                        }
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }

        } catch (error) {
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }
}

module.exports={
    inserirUsuario,
    autenticarUsuario,
    listarUsuario,
    buscarUsuario
}
