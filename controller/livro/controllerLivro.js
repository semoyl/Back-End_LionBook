/****************************************************************************************
 * Objetivo: Controller responsável pela regra de negócio do CRUD do livro
 * Data: 30/10/2025
 * Autor: Sistema LionBook
 * Versão: 1.0
 * **************************************************************************************/
//Import do arquivo de configuração para mensagens e status code
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar o CRUD no BD
const livroDAO = require('../../model/DAO/livro.js')

//Função para inserir um novo livro
const inserirLivro = async function(livro, contentType){ 
try {
        if(contentType == 'application/json'){
            if(
                livro.titulo            == undefined   ||   livro.titulo            == ''   || livro.titulo             == null     ||  livro.titulo.length             > 100 ||
                livro.data_publicacao   == undefined   ||   livro.data_publicacao   == ''   || livro.data_publicacao    == null     ||
                livro.quantidade        == undefined   ||   livro.quantidade        == null ||  isNaN(livro.quantidade)            ||  livro.quantidade < 0 ||
                livro.isbn              == undefined   ||   livro.isbn.length       > 45    
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                //Encaminha os dados do novo livro para ser inserido no BD
                let resultLivro = await livroDAO.insertLivro(livro)

                if(resultLivro)
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

//Função para atualizar um livro
const atualizarLivro = async function(livro, id, contentType){ 
        try {
            if(contentType == 'application/json'){
                    if(
                        livro.titulo            == undefined   ||   livro.titulo            == ''   || livro.titulo             == null     ||  livro.titulo.length             > 100 ||
                        livro.data_publicacao   == undefined   ||   livro.data_publicacao   == ''   || livro.data_publicacao    == null     ||
                        livro.quantidade        == undefined   ||   livro.quantidade        == null ||  isNaN(livro.quantidade)            ||  livro.quantidade < 0 ||
                        livro.isbn              == undefined   ||   livro.isbn.length       > 45    ||
                        id                      == undefined   ||   id== ""         || id == null   || isNaN(id)    || id <=0                                                                        
        
                    ){
                        return MESSAGE.ERROR_REQUIRED_FIELDS //400
                    }else{
                        //Validar se o ID existe no banco de dados
                        let resultLivro = await buscarLivro(parseInt(id))

                        if(resultLivro.status_code == 200){
                                //Adiciona um atributo id no JSON para encaminhar o id da requisição
                                livro.id = parseInt(id)
                                //Update
                                let result = await livroDAO.updateLivro(livro)

                                if(result)
                                    return MESSAGE.SUCCESS_UPDATED_ITEM //200
                                else
                                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                        }else if(resultLivro.status_code == 404){
                            return MESSAGE.ERROR_NOT_FOUND //404
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
                        }
                    }
                }else{
                    return MESSAGE.ERROR_CONTENT_TYPE //415
                }
        } catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }
}

//Função para excluir um livro
const deletarLivro = async function(id){ 
    try {
        if(
            id          == ""            || 
            id          == undefined     || 
            id          == null          ||
            isNaN(id)                    ||
            id          <= 0 
        ){
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }else{
            //Chama a função para deletar
            let resultLivro = await buscarLivro(parseInt(id))
            
            if(resultLivro.status_code == 200){
                    //Delete
                    let result = await livroDAO.deleteLivro(parseInt(id))

                    if(result){
                        return MESSAGE.SUCCESS_DELETED_ITEM
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }

            }else if(resultLivro.status_code == 404){
                return MESSAGE.ERROR_NOT_FOUND //404
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
            }
        }

} catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
}

//Função para retornar todos os livros
const listarLivro = async function(){ 
    try {
        let dadosLivros = {}

        //Chama a função para retornar os dados do livro
        let resultLivro = await livroDAO.selectAllLivro()

        if(resultLivro != false || typeof(resultLivro) == 'object'){
            if(resultLivro.length > 0){

                //Cria um objeto do tipo JSON para retornar a lista de livros
                dadosLivros.status = true
                dadosLivros.status_code = 200
                dadosLivros.items = resultLivro.length
                dadosLivros.books = resultLivro

                return dadosLivros //200
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

//Função para buscar um livro pelo ID
const buscarLivro = async function(id){
        try {

                let dadosLivros = {}
                if(
                    id          == ""            || 
                    id          == undefined     || 
                    id          == null          ||
                    isNaN(id)                    ||
                    id          <= 0   
                ){
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                }else{
                    //Chama a função para retornar os dados do livro
                    let resultLivro = await livroDAO.selectByIDLivro(parseInt(id))

                    if(resultLivro != false || typeof(resultLivro) == 'object'){
                        if(resultLivro.length > 0){

                            //Cria um objeto do tipo JSON para retornar a lista de livros
                            dadosLivros.status = true
                            dadosLivros.status_code = 200
                            dadosLivros.books = resultLivro

                            return dadosLivros //200
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

//Função para buscar livros por título (busca rápida)
const buscarLivroPorTitulo = async function(titulo){
    try {
        let dadosLivros = {}
        
        if(
            titulo == ""            || 
            titulo == undefined     || 
            titulo == null          
        ){
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }else{
            //Chama a função para retornar os dados do livro por título
            let resultLivro = await livroDAO.selectByTituloLivro(titulo)

            if(resultLivro != false || typeof(resultLivro) == 'object'){
                if(resultLivro.length > 0){
                    //Cria um objeto do tipo JSON para retornar a lista de livros
                    dadosLivros.status = true
                    dadosLivros.status_code = 200
                    dadosLivros.items = resultLivro.length
                    dadosLivros.books = resultLivro

                    return dadosLivros //200
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
    inserirLivro,
    atualizarLivro,
    deletarLivro,
    listarLivro,
    buscarLivro,
    buscarLivroPorTitulo
}
