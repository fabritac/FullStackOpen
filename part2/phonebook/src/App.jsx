import { useState } from 'react'

const Filter = ({value, onChange}) => {
  return (
    <form>
      <div>
        filter: <input value={value} onChange={onChange}/>
      </div>
    </form>
  )
}

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => 
        <p key={person.id}>{person.name} {person.number}</p>
      )}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find((element) => element.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else if(persons.find((element) => element.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
    } else {
      const personObj = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      setPersons(persons.concat(personObj))
      setNewName('')
      setNewNumber('')
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={newFilter} onChange={handleFilterChange} />
      
      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson} 
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App