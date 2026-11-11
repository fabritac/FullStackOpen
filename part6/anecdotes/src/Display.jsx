import { useStoreState, useStoreActions } from './store'
import { anecdotes } from './data/anecdotes'

const Display = () => {
  const { selected, votes } = useStoreState()
  const { handleSelected, handleVotes, addAnecdote: addAnecdoteToStore } = useStoreActions()
  const maxVotes = Math.max(...votes)
  const maxIndex = votes.indexOf(maxVotes)

  const addAnecdote = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const anecdote = form.anecdote.value.trim()
    if (anecdote) {
      addAnecdoteToStore(anecdote)
      form.reset()
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={handleSelected}>next anecdote</button>
      <button onClick={handleVotes}>Vote</button>
      <h1>anecdote with most votes</h1>
      <div>{anecdotes[maxIndex]}</div>
      <div>has {votes[maxIndex]} votes</div>
      <h1>Add a new anecdote</h1>
      <form onSubmit={addAnecdote}>
        <input type="text" name="anecdote" placeholder="Enter your anecdote" />
        <button type="submit">Add Anecdote</button>
      </form>
    </div>
  )
}

export default Display