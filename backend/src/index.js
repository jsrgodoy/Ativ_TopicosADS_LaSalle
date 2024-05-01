//Importações 
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Ajv = require("ajv")

//Instâncias do express
const app = express()
app.use(cors())
app.use(express.json())

const port = 3000
// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb+srv://jsrgodoy:BZsovJp9C4l31JVJ@cluster0.w8cuev4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Definir o esquema do modelo de Música
const musicSchema = mongoose.Schema({
    name: { type: String, minLength: 1, required: true },
    artist: { type: String, minLength: 1, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
})
//Adiciona modelo música
const Music = mongoose.model("Music", musicSchema)

// Sub-colletction - Definir esquema Modelo de Comentário
const commentSchema = mongoose.Schema({
  text: String,
  autor: String,
  music: { type: mongoose.Schema.Types.ObjectId, ref: "Music" }
});
//Add modelo de Comentário
const Comment = mongoose.model("Comment", commentSchema);

// Defina o esquema do modelo de dados para o gráfico
const dadosSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Campo para representar a data
  quantidade: { type: Number, required: true } // Campo para representar a quantidade por dia
})
//Add modelo Dados para o gráfico
const Dados = mongoose.model('Dados', dadosSchema)

// JSONSCHEMA - validação de dados de entrada
const musicValidationSchema = {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      artist: { type: "string", minLength: 1 }
    },
    required: ["name", "artist"],
    additionalProperties: false
  };
  
  const ajv = new Ajv()
  const validateMusic = ajv.compile(musicValidationSchema)

//Crianto rotas da API

//Obter todos os registros
app.get("/", async (req, res) => {
  try {
    const music = await Music.find()
    return res.send(music)
  } catch (error) {
    console.error("Erro ao buscar as músicas", error)
    res.status(500).send("Erro ao buscar as músicas.")
  }
})
// Pesquisa por nome e artista
app.get("/search", async (req, res) => {
    // Extrai os parâmetros de consulta da requisição
    const { name, artist } = req.query
    // Constrói o objeto de filtro com base nos parâmetros fornecidos
    const filter = {};
    if (name) {
        filter.name = { $regex: name, $options: "i" } // Realiza uma pesquisa por nome, ignorando maiúsculas e minúsculas
    }
    if (artist) {
        filter.artist = { $regex: artist, $options: "i" } // Realiza uma pesquisa por artista, ignorando maiúsculas e minúsculas
    }
    try {
        // Executa a consulta usando o filtro construído
        const music = await Music.find(filter)
        return res.send(music);
    } catch (error) {
        // Trata erros de consulta
        console.error("Erro ao buscar registros:", error)
        return res.status(500).send("Erro ao buscar registros.")
    }
})
//Deletar registro
app.delete("/:id", async(req, res) =>{
    const music = await Music.findByIdAndDelete(req.params.id)
    return res.send(music)
})

//Editar registro
app.put("/:id", async(req, res) =>{
    const music = await Music.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        artist: req.body.artist  
    }, {
        new: true 
    })    
    return res.send(music)
})

//adicionar musica
app.post("/music", async (req, res) => {    
      // Validar os dados de entrada usando o esquema JSON
      //const validate = ajv.compile(musicValidationSchema)
      const valid = validateMusic(req.body)
      if (!valid) {
        return res.status(400).json({ error: 'Dados de entrada inválidos', errors: validate.errors })
      }
    try{
        const music = new Music({
        name: req.body.name,
        artist: req.body.artist
    })
    await music.save()
    return res.status(201).send(music)        
    }catch (error){
        console.error("Erro ao adicionar música:", error);
        return res.status(500).send("Erro ao adicionar música")
    }        
    })    
  
  // Rota para adicionar um comentário a uma música específica
app.post("/:musicId/comments", async (req, res) => {
    try {   
      const musicId = req.params.musicId 
      if (!mongoose.Types.ObjectId.isValid(musicId)) {
          return res.status(400).send("ID de música inválido.")
        }
      const music = await Music.findOne({_id: musicId})
      if (!music) {
        return res.status(404).send("Música não encontrada.")
      }  
      const comment = new Comment({
        text: req.body.text,
        autor: req.body.autor,
        music: music._id
      });  
      await comment.save()
      music.comments.push(comment)
      await music.save() 
      return res.status(201).send(comment)
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      return res.status(500).send("Erro ao adicionar comentário.")
    }
  });
  
  // Rota para buscar todos os comentários de uma música específica
  app.get("/:musicId/comments", async (req, res) => {
    try {
      const music = await Music.findById(req.params.musicId).populate("comments");
      if (!music) {
        return res.status(404).send("Música não encontrada.");
      }  
      return res.send(music.comments);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      return res.status(500).send("Erro ao buscar comentários.");
    }
  })
  
// Rota para retornar os dados para o gráfico
app.get('/data', async (req, res) => {
  try {
      // Busque os dados do banco de dados e ordene por data
      const dados = await Dados.find().sort({ date: 1 })
      // Extrai as datas e quantidades dos dados
      const labels = dados.map(dado => dado.date.toISOString()) // Formate as datas como strings ISO
      const values = dados.map(dado => dado.quantidade)
      // Formate os dados no formato necessário para o gráfico
      const data = {labels, values}
      // Retorne os dados como resposta JSON
      res.json(data)
  } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      res.status(500).send("Erro ao buscar os dados.");
  }
})

app.listen(port, () =>{
  console.log("Server running")
})