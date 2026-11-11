import { useStoreState, useStoreActions } from '../store'
import { anecdotes } from '../data/anecdotes'

const AnecdoteList = () => {
  const { selected, votes } = useStoreState()
  const { handleSelected, handleVotes } = useStoreActions()
  const maxVotes = Math.max(...votes)
  const maxIndex = votes.indexOf(maxVotes)

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
    </div>
  )
}

export default AnecdoteList