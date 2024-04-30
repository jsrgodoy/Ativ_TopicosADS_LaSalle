
const express = require("express")
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
const port = 3000


const Music = mongoose.model('Music', {
    name: String,
    artist: String
})

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
        return res.status(500).send("Erro ao buscar registros.");
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
    const music = new Music({
        name: req.body.name,
        artist: req.body.artist
    })
    await music.save()
    return res.send(music)
})

app.listen(port, () =>{
    mongoose.connect('mongodb+srv://jsrgodoy:JdfUchBkEhnolGmR@cluster0.w8cuev4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log('App running')
})