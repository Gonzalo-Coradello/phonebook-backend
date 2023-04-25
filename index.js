const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

app.get('/info', (req, res) => {
  const quantity = persons.length
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${quantity} people.</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(!person) return res.status(404).json({status: "error", error: `Person with ID ${id} does not exist`})
  res.json(person)
})

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 10000 + 1)
  const { name, number } = req.body
  if(!name || !number) return res.status(400).json({status: "error", error: "You must provide a name and a phone number"})
  const duplicateID = persons.find(p => p.id === id)
  if(duplicateID) return res.status(400).json({status: "error", error: "Duplicated ID"})
  const duplicateName = persons.find(p => p.name === name)
  if(duplicateName) return res.status(400).json({status: "error", error: `${name} already exists in the phonebook.`})

  const person = {
    id,
    name,
    number
  }

  persons.push(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(!person) return res.status(404).json({status: "error", error: `Person with ID ${id} does not exist`})
  persons = persons.filter(p => p.id !== id) 
  res.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))