import { useStoreActions } from '../store'

const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToStore } = useStoreActions()

  const addAnecdote = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const anecdote = form.anecdote.value.trim()
    if (anecdote) {
      addAnecdoteToStore(anecdote).then(() => form.reset())
    }
  }

  return (
    <div>
      <h1>create new anecdote</h1>
      <form onSubmit={addAnecdote}>
        <input type="text" name="anecdote" placeholder="Enter your anecdote" />
        <button type="submit">Add Anecdote</button>
      </form>
    </div>
  )
}

export default AnecdoteForm