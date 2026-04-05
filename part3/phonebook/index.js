require('dotenv').config()

const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')

morgan.token('content-post', function functionGetContentPost(request) {
    const name = request.body.name
    const number = request.body.number
    return JSON.stringify({ name: name, number: number })
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms',
    {
        skip: (request) => request.method === 'POST'
    }
))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content-post',
    {
        skip: (request) => request.method !== 'POST'
    }
))
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('Hello, world!')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    const phonebookSize = persons.length
    const currentDate = new Date()
    response.send(`Phonebook has info for ${phonebookSize} people. <br>Current date: ${currentDate}`);
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(() => response.status(400).end())
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
