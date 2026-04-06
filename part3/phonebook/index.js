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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const date = new Date()
        response.send(
            `<p>Phonebook has info for ${count} people<\p><p>${date}</p>`
        )
    })
})

const unknowEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.use(unknowEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
