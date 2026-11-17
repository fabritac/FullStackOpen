import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, isPending, addAnecdote: addAnecdoteToServer, updateAnecdote } = useAnecdotes()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer({ content, votes: 0 })
  }

  if (isPending) {
    return <div>loading data...</div>
  }

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updateAnecdote(updatedAnecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm onSubmit={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App