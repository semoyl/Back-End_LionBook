/****************************************************************************************
 * Objetivo: API referente ao projeto Sistema de Gestão de Acervo - LionBook
 * Data: 30/10/2025
 * Autor: Gustavo Rocha
 * Versão: 1.0
 * Observação:
 *********Para configurar e insatalar a API, precisamos das seguintes bibliotecas
 *              express         npm install express --save
 *              cors            npm install cors --save
 *              body-parser     npm install body-parser --save
 * ******** Para configurar e instalar o acesso ao Banco de Dados precisamos:
 *              prisma          npm install prisma --save (conexão com BD)
 *              prisma/client   npm install @prisma/client --save (executa scripts no BD)
 *              
 *** Após a instalação do prisma e do prisma client, devemos:
        npx prisma init  (Inicializar o prisma no projeto)

*** Para realizar o sincronismo do prisma com o Bd, devemos executar o seguinte comando:
        npx prisma migrate dev
**************************************************************************************/

//Import das bibliotecas para criar a API
const express   = require('express')
const cors      = require('cors')
const bodyParser= require('body-parser')

//Import das controllers para realizar o CRUD de dados
const controllerLivro = require('./controller/livro/controllerLivro.js')
const controllerMovimentacao = require('./controller/movimentacao/controllerMovimentacao.js')
const controllerUsuario = require('./controller/usuario/controllerUsuario.js')

//Estabelecendo o formato de dados que devera chegar no body da requisição (POST ou PUT)
const bodyParserJSON = bodyParser.json()

//Cria o objeto app para criar a API
const app = express()

//Configurações do cors
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

/*************************** ENDPOINTS DE LIVROS ***************************/

//Endpoint para inserir um livro no BD
app.post('/v1/lionbook/livro', cors(), bodyParserJSON, async function (request, response) {

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']
    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminhando os dados do body da requisição para a controller inserir no BD
    let resultLivro = await controllerLivro.inserirLivro(dadosBody, contentType)

    response.status(resultLivro.status_code)
    response.json(resultLivro)

})

//Endpoint para retornar uma lista de livros
app.get('/v1/lionbook/livros', cors(), async function(request, response){
    //Chama a função para listar livros
    let resultLivro = await controllerLivro.listarLivro()

    response.status(resultLivro.status_code)
    response.json(resultLivro)
})

//Endpoint para buscar um livro pelo ID
app.get('/v1/lionbook/livro/:id', cors(), async function (request, response) {

    //Cria o Request para receber o id
    let idLivro = request.params.id

    //Chama a função para buscar livro pelo id
    let resultLivro = await controllerLivro.buscarLivro(idLivro)

    response.status(resultLivro.status_code)
    response.json(resultLivro)
})

//Endpoint para buscar livros por título
app.get('/v1/lionbook/livros/buscar/:titulo', cors(), async function (request, response) {

    //Cria o Request para receber o título
    let titulo = request.params.titulo

    //Chama a função para buscar livros pelo título
    let resultLivro = await controllerLivro.buscarLivroPorTitulo(titulo)

    response.status(resultLivro.status_code)
    response.json(resultLivro)
})

//Endpoint para deletar um livro pelo ID
app.delete('/v1/lionbook/livro/:id', cors(), async function (request, response) {

    //Cria o Request para receber o id
    let idLivro = request.params.id

    //Chama a função para deletar o livro pelo id
    let resultLivro = await controllerLivro.deletarLivro(idLivro)

    response.status(resultLivro.status_code)
    response.json(resultLivro)
})

//Endpoint para atualizar um livro pelo ID
app.put('/v1/lionbook/livro/:id', cors(), bodyParserJSON, async function (request, response) {
    
    //Recebe o content type da requisição
    let contentType  = request.headers['content-type']
    //Recebe o ID do livro
    let idLivro       = request.params.id
    //Recebe os dados do livro encaminhado no body da requisição
    let dadosBody    = request.body

    let resultLivro   = await controllerLivro.atualizarLivro(dadosBody, idLivro, contentType)

    response.status(resultLivro.status_code)
    response.json(resultLivro)
})

/********************* ENDPOINTS DE MOVIMENTAÇÕES **********************/

//Endpoint para inserir uma movimentação (entrada/saída)
app.post('/v1/lionbook/movimentacao', cors(), bodyParserJSON, async function (request, response) {

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']
    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminhando os dados do body da requisição para a controller inserir no BD
    let resultMovimentacao = await controllerMovimentacao.inserirMovimentacao(dadosBody, contentType)

    response.status(resultMovimentacao.status_code)
    response.json(resultMovimentacao)

})

//Endpoint para listar todas as movimentações
app.get('/v1/lionbook/movimentacoes', cors(), async function(request, response){
    //Chama a função para listar movimentações
    let resultMovimentacao = await controllerMovimentacao.listarMovimentacao()

    response.status(resultMovimentacao.status_code)
    response.json(resultMovimentacao)
})

//Endpoint para buscar uma movimentação pelo ID
app.get('/v1/lionbook/movimentacao/:id', cors(), async function (request, response) {

    //Cria o Request para receber o id
    let idMovimentacao = request.params.id

    //Chama a função para buscar movimentação pelo id
    let resultMovimentacao = await controllerMovimentacao.buscarMovimentacao(idMovimentacao)

    response.status(resultMovimentacao.status_code)
    response.json(resultMovimentacao)
})

//Endpoint para buscar movimentações por livro
app.get('/v1/lionbook/movimentacoes/livro/:id', cors(), async function (request, response) {

    //Cria o Request para receber o id do livro
    let idLivro = request.params.id

    //Chama a função para buscar movimentações pelo livro
    let resultMovimentacao = await controllerMovimentacao.buscarMovimentacoesPorLivro(idLivro)

    response.status(resultMovimentacao.status_code)
    response.json(resultMovimentacao)
})

//Endpoint para listar tipos de movimentação
app.get('/v1/lionbook/tipos-movimentacao', cors(), async function(request, response){
    //Chama a função para listar tipos de movimentação
    let resultTipos = await controllerMovimentacao.listarTiposMovimentacao()

    response.status(resultTipos.status_code)
    response.json(resultTipos)
})

/************************** ENDPOINTS DE USUÁRIOS **************************/

//Endpoint para autenticar usuário (RF005 - Autenticar usuário)
app.post('/v1/lionbook/login', cors(), bodyParserJSON, async function (request, response) {

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']
    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminhando os dados do body da requisição para a controller autenticar
    let resultLogin = await controllerUsuario.autenticarUsuario(dadosBody, contentType)

    response.status(resultLogin.status_code)
    response.json(resultLogin)

})

//Endpoint para cadastrar usuário (apenas para uso via Postman)
app.post('/v1/lionbook/usuario', cors(), bodyParserJSON, async function (request, response) {

    //Recebe o content type para validar o tipo de dados da requisição
    let contentType = request.headers['content-type']
    //Recebe o conteúdo do body da requisição
    let dadosBody = request.body

    //Encaminhando os dados do body da requisição para a controller inserir no BD
    let resultUsuario = await controllerUsuario.inserirUsuario(dadosBody, contentType)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)

})

//Endpoint para listar usuários
app.get('/v1/lionbook/usuarios', cors(), async function(request, response){
    //Chama a função para listar usuários
    let resultUsuario = await controllerUsuario.listarUsuario()

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//Endpoint para buscar um usuário pelo ID
app.get('/v1/lionbook/usuario/:id', cors(), async function (request, response) {

    //Cria o Request para receber o id
    let idUsuario = request.params.id

    //Chama a função para buscar usuário pelo id
    let resultUsuario = await controllerUsuario.buscarUsuario(idUsuario)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//Endpoint para verificar se a API está funcionando
app.get('/v1/lionbook/status', cors(), async function(request, response){
    response.status(200)
    response.json({
        status: true,
        status_code: 200,
        message: "API LionBook está funcionando ! ! !",
        version: "1.0"
    })
})

app.listen(8080, function(){
    console.log('API LionBook aguardando requisições na porta 8080 . . .')
})
