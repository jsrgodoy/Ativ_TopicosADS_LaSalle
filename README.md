# Atividade Avaliatica Tópicos Especiais em ADS

### Ferramentas

- VSCode
- Node.js
- JavaScript
- Express
- Cors
- Mongoose
- MongoDB
- Nodemon
- Insomnia

### CONTEXTUALIZAÇÃO

`Banco de Dados NoSQL`

O objetivo desta atividade é permitir o estudante se familiarizar com
Bancos de Dados NoSQL, tanto para gravação quanto para leitura de
dados, levando em consideração aspectos relacionados às interfaces
programáticas para realizar tais operações

### TAREFA

Desenvolva uma solução no formato RESTFul API, que suporte as
seguintes operações:

1. Adicionar dados
2. Editar dados
3. Excluir dados
4. Consultar registro individualmente
5. Consultar um grupo de registros

A API deverá armazenar os dados em Banco de Dados NoSQL de sua escolha.
A solução deverá possuir as seguintes características:

1. Validação dos dados de entrada com JSON Schema
2. Utilização de ao menos uma sub-collection
3. Interface em dashboard que exiba um gráfico com base nos dados do banco.

Elabore um documento técnico de ao menos 1 página que descreva a API, e a estrutura do banco de dados.

### Documento Técnico: API de Músicas e Comentários

1. Introdução:
   A API de Músicas e Comentários é uma aplicação desenvolvida para gerenciar informações sobre músicas e permitir aos usuários adicionar e visualizar comentários sobre essas músicas. Este documento descreve a estrutura da API e do banco de dados, bem como os endpoints disponíveis para interagir com a API.

2. Estrutura da API:
   A API é construída usando o framework Express.js para Node.js. Ela fornece endpoints para operações CRUD (Criar, Ler, Atualizar e Deletar) em músicas e comentários, bem como recursos para busca e filtragem de músicas.
   Endpoints Disponíveis:
   GET /: Retorna todas as músicas cadastradas no banco de dados.
   GET /search: Permite buscar músicas com base em parâmetros como nome e artista.
   GET /music/:id: Retorna uma música específica com base no ID fornecido.
   POST /music: Cria uma nova música com base nos dados fornecidos.
   PUT /id: Atualiza uma música existente com base no ID fornecido e nos dados fornecidos no corpo da requisição.
   DELETE /:id: Remove uma música do banco de dados com base no ID fornecido.
   POST /musicId/comments: Adiciona um comentário a uma música específica com base no ID fornecido.
   GET /musicId/comments: Retorna todos os comentários associados a uma música específica com base no ID fornecido.
   GET /data: Fornece dados para um gráfico com base nas informações das músicas.

3. Estrutura do Banco de Dados:
   O banco de dados utilizado é o MongoDB, um banco de dados NoSQL orientado a documentos. A estrutura do banco de dados inclui duas coleções principais: "Music" e "Comment".
   Music: Armazena informações sobre as músicas, incluindo nome, artista e uma lista de comentários associados.
   Comment: Contém os comentários feitos pelos usuários para as músicas. Cada comentário está relacionado a uma música específica.

4. Validação de Dados:
   A API realiza a validação dos dados de entrada utilizando JSON Schema. O esquema de validação especifica que os campos name e artist são obrigatórios para adicionar uma nova música, garantindo a integridade dos dados.

5. Subcoleção de Comentários:
   Os comentários são armazenados em uma subcoleção chamada Comment, o que permite associar vários comentários a uma única música de forma eficiente. Cada comentário contém informações como texto, autor e referência à música associada.

6. Interface do Dashboard:
   A rota /data é responsável por fornecer dados para um gráfico com base nas informações das músicas. Os dados são processados para extrair o nome das músicas como rótulos e o número total de músicas como valores. Uma interface de dashboard pode consumir esses dados e utilizar bibliotecas de gráficos como Chart.js ou D3.js para criar visualizações de dados interativas.

7. Conclusão:
   A API de Músicas oferece uma solução robusta para gerenciar músicas e comentários, além de fornecer dados para visualizações de gráficos. Com uma estrutura bem definida e validação de dados implementada, a API é capaz de atender às necessidades de uma aplicação de gerenciamento de músicas. Possíveis melhorias futuras podem incluir a implementação de autenticação de usuários, paginação de resultados e otimizações de desempenho.
   Este documento fornece uma visão geral da API de Músicas, descrevendo sua estrutura, funcionalidades e implementações técnicas.
