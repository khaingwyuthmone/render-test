const express = require('express');
const cors    = require('cors');
const app = express();
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
      },
      {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
      },
      {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
})

app.get('/api/notes', (request,response) =>{
    response.json(notes);
});

const generateId = () =>{
    const maxId = notes.length > 0 ? 
                    Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
} 

app.post('/api/notes', (request,response) =>{
    
    const note  = request.body;
    if(!note.content){
        return response.status(400).json({
            error : "Content missing"
        })
    }

    const newNote = {
        content : note.content,
        important : note.important || false,
        id : generateId()
    }

    notes = notes.concat(newNote);
    response.json(newNote)
});

app.get('/api/notes/:id', (request , response)=>{
    // console.log("Request :", request)
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id)
    if(note){
        response.json(note)
    }else{
        response.status(404).send("The resource is not found on our server.");
    }
    
})

app.delete('/api/notes/:id', (request, response) =>{
    const id = Number(request.params.id);
    notes  = notes.filter(note => note.id !== id);

    response.status(204).end();
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})