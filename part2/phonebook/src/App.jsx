import { useEffect, useState } from 'react'
import personService from './services/persons'
import {NotificationError, NotificationSuccess } from './components/notification'

const Filter = ({value, onChange}) => {
  return (
    <div>
      filter: <input value={value} onChange={onChange}/>
    </div>
  )
}

const Persons = ({ persons, setPersons, setErrorMessage }) => {
  const handleDelete = (person) => {
    if (window.confirm(`Do you want to remove ${person.name}`)) {
      personService.deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setErrorMessage(`${person.name} has been deleted`)
          setTimeout(() => {
          setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <ul>
      {persons.map(person => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person)}>delete</button>
        </li>
      ))}
    </ul>
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
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  

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

    const existingPerson = persons.find(element => element.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} already has a number, change it?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(prev =>
              prev.map(p => p.id !== returnedPerson.id ? p : returnedPerson)
            )
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Information of ${existingPerson.name} has already removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    } 
    
    if (persons.find((p) => p.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
      return
    } 
    
    const personObj = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObj)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`${returnedPerson.name} has been added successfully in the phonebook`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })  
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  return (
    <div>
      
      <NotificationError message={errorMessage} />
      <NotificationSuccess message={successMessage} />
      
      <h2>Phonebook</h2>
      
      <Filter value={newFilter} onChange={handleFilterChange} />
      
      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson} 
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      
      <Persons persons={personsToShow} setPersons={setPersons} setErrorMessage={setErrorMessage}/>
    </div>
  )
}

export default App