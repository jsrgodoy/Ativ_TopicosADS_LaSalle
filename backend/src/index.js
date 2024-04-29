
const express = require("express")
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
const port = 3000


const Music = mongoose.model('Music', {
    name: String,
    artist: String
})

app.get("/", async (req, res) => {
    const music = await Music.find()
    return res.send(music)
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