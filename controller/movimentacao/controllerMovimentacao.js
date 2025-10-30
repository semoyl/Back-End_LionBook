/****************************************************************************************
 * Objetivo: Controller responsável pela regra de negócio do CRUD da movimentação
 * Data: 30/10/2025
 * Autor: Sistema LionBook
 * Versão: 1.0
 * **************************************************************************************/
//Import do arquivo de configuração para mensagens e status code
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar o CRUD no BD
const movimentacaoDAO = require('../../model/DAO/movimentacao.js')
const livroDAO = require('../../model/DAO/livro.js')

//Função para inserir uma nova movimentação (entrada ou saída)
const inserirMovimentacao = async function(movimentacao, contentType){ 
try {
        if(contentType == 'application/json'){
            if(
                movimentacao.id_movimentacao     == undefined   ||   movimentacao.id_movimentacao     == null ||  isNaN(movimentacao.id_movimentacao)   ||  movimentacao.id_movimentacao <= 0 ||
                movimentacao.id_usuario          == undefined   ||   movimentacao.id_usuario          == null ||  isNaN(movimentacao.id_usuario)        ||  movimentacao.id_usuario <= 0 ||
                movimentacao.quantidade          == undefined   ||   movimentacao.quantidade          == null ||  isNaN(movimentacao.quantidade)       ||  movimentacao.quantidade <= 0 ||
                movimentacao.data_movimentacao   == undefined   ||   movimentacao.data_movimentacao   == ''   ||  movimentacao.data_movimentacao == null ||
                movimentacao.id_livro            == undefined   ||   movimentacao.id_livro            == null ||  isNaN(movimentacao.id_livro)         ||  movimentacao.id_livro <= 0
            ){
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                //Verificar se o livro existe
                let livroExiste = await livroDAO.selectByIDLivro(movimentacao.id_livro)
                
                if(!livroExiste || livroExiste.length == 0) {
                    return MESSAGE.ERROR_NOT_FOUND //404 - Livro não encontrado
                }

                let livroAtual = livroExiste[0]
                
                //Verificar se é entrada (1) ou saída (2)
                if(movimentacao.id_movimentacao == 2) { // Saída
                    if(livroAtual.quantidade < movimentacao.quantidade) {
                        return {status: false, status_code: 400, message: "Quantidade insuficiente em estoque para realizar a saída ! ! !"}
                    }
                }

                //Inserir a movimentação
                let resultMovimentacao = await movimentacaoDAO.insertMovimentacao(movimentacao)

                if(resultMovimentacao) {
                    //Atualizar a quantidade do livro
                    let novaQuantidade = livroAtual.quantidade
                    
                    if(movimentacao.id_movimentacao == 1) { // Entrada
                        novaQuantidade += movimentacao.quantidade
                    } else if(movimentacao.id_movimentacao == 2) { // Saída
                        novaQuantidade -= movimentacao.quantidade
                    }

                    //Atualizar o livro com a nova quantidade
                    let livroAtualizado = {
                        id: livroAtual.id,
                        titulo: livroAtual.titulo,
                        data_publicacao: livroAtual.data_publicacao,
                        quantidade: novaQuantidade,
                        isbn: livroAtual.isbn
                    }

                    let resultAtualizacao = await livroDAO.updateLivro(livroAtualizado)
                    
                    if(resultAtualizacao) {
                        return MESSAGE.SUCCESS_CREATED_ITEM //201
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        } 
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para retornar todas as movimentações
const listarMovimentacao = async function(){ 
    try {
        let dadosMovimentacoes = {}

        //Chama a função para retornar os dados das movimentações
        let resultMovimentacao = await movimentacaoDAO.selectAllMovimentacao()

        if(resultMovimentacao != false || typeof(resultMovimentacao) == 'object'){
            if(resultMovimentacao.length > 0){

                //Cria um objeto do tipo JSON para retornar a lista de movimentações
                dadosMovimentacoes.status = true
                dadosMovimentacoes.status_code = 200
                dadosMovimentacoes.items = resultMovimentacao.length
                dadosMovimentacoes.movimentacoes = resultMovimentacao

                return dadosMovimentacoes //200
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

//Função para buscar uma movimentação pelo ID
const buscarMovimentacao = async function(id){
        try {

                let dadosMovimentacoes = {}
                if(
                    id          == ""            || 
                    id          == undefined     || 
                    id          == null          ||
                    isNaN(id)                    ||
                    id          <= 0   
                ){
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                }else{
                    //Chama a função para retornar os dados da movimentação
                    let resultMovimentacao = await movimentacaoDAO.selectByIDMovimentacao(parseInt(id))

                    if(resultMovimentacao != false || typeof(resultMovimentacao) == 'object'){
                        if(resultMovimentacao.length > 0){

                            //Cria um objeto do tipo JSON para retornar a movimentação
                            dadosMovimentacoes.status = true
                            dadosMovimentacoes.status_code = 200
                            dadosMovimentacoes.movimentacoes = resultMovimentacao

                            return dadosMovimentacoes //200
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

//Função para buscar movimentações por livro
const buscarMovimentacoesPorLivro = async function(id_livro){
    try {
        let dadosMovimentacoes = {}
        
        if(
            id_livro == ""            || 
            id_livro == undefined     || 
            id_livro == null          ||
            isNaN(id_livro)           ||
            id_livro <= 0
        ){
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }else{
            //Chama a função para retornar as movimentações do livro
            let resultMovimentacao = await movimentacaoDAO.selectByLivroMovimentacao(parseInt(id_livro))

            if(resultMovimentacao != false || typeof(resultMovimentacao) == 'object'){
                if(resultMovimentacao.length > 0){
                    //Cria um objeto do tipo JSON para retornar a lista de movimentações
                    dadosMovimentacoes.status = true
                    dadosMovimentacoes.status_code = 200
                    dadosMovimentacoes.items = resultMovimentacao.length
                    dadosMovimentacoes.movimentacoes = resultMovimentacao

                    return dadosMovimentacoes //200
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

//Função para listar tipos de movimentação
const listarTiposMovimentacao = async function(){ 
    try {
        let dadosTipos = {}

        //Chama a função para retornar os tipos de movimentação
        let resultTipos = await movimentacaoDAO.selectAllTipoMovimentacao()

        if(resultTipos != false || typeof(resultTipos) == 'object'){
            if(resultTipos.length > 0){

                //Cria um objeto do tipo JSON para retornar a lista de tipos
                dadosTipos.status = true
                dadosTipos.status_code = 200
                dadosTipos.items = resultTipos.length
                dadosTipos.tipos = resultTipos

                return dadosTipos //200
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

module.exports={
    inserirMovimentacao,
    listarMovimentacao,
    buscarMovimentacao,
    buscarMovimentacoesPorLivro,
    listarTiposMovimentacao
}
