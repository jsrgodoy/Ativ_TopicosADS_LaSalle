
const express = require("express")
const mongoose = require('mongoose')


const app = express()
app.use(express.json())
const port = 3000


// Definir o esquema MusicSchema
const MusicSchema = mongoose.Schema({
    name: String,
    artist: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

//Adicionar modelo do bd Music
const Music = mongoose.model('Music', MusicSchema)

// JSONSCHEMA
const musicSchema = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      artist: { type: 'string', minLength: 1 }
    },
    required: ['name', 'artist'],
    additionalProperties: false
  };
  
  const Ajv = require('ajv')
  const ajv = new Ajv()

//Crianto rotas

app.get("/", async (req, res) => {
    const music = await Music.find()
    return res.send(music)
})

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

app.delete("/:id", async(req, res) =>{
    const music = await Music.findByIdAndDelete(req.params.id)
    return res.send(music)
})

app.put("/:id", async(req, res) =>{
    const music = await Music.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        artist: req.body.artist  
    }, {
        new: true 
    })
    
    return res.send(music)
})

app.post("/", async (req, res) => {    
      // Validar os dados de entrada usando o esquema JSON
      const validate = ajv.compile(musicSchema);
      const valid = validate(req.body);
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
        return res.status(500).send("Erro ao lançar dados")
    }
        
    })

    // Sub-colletction - Modelo de Comentário
const Comment = mongoose.model("Comment", {
    text: String,
    autor: String,
    music: { type: mongoose.Schema.Types.ObjectId, ref: "Music" }
  });

  const ObjectId = mongoose.Types.ObjectId;
  
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
      const music = await Music.findById(req.params.musicId).populate("comments")
      if (!music) {
        return res.status(404).send("Música não encontrada.")
      }
  
      return res.send(music.comments)
    } catch (error) {
      console.error("Erro ao buscar comentários:", error)
      return res.status(500).send("Erro ao buscar comentários.")
    }
  })



app.listen(port, () =>{
    mongoose.connect('mongodb+srv://jsrgodoy:BZsovJp9C4l31JVJ@cluster0.w8cuev4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log('App running')
})