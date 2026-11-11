import { useStoreState, useStoreActions } from '../store'
import { anecdotes } from '../data/anecdotes'

const AnecdoteList = () => {
  const { votes } = useStoreState()
  const { handleVotes } = useStoreActions()

  const anecdotesSorted = anecdotes.toSorted((a, b) => votes[anecdotes.indexOf(b)] - votes[anecdotes.indexOf(a)])

  return (
    <div>
      <h1>All Anecdotes</h1>
      <ul>
        {anecdotesSorted.map((anecdote, index) => {
          const anecdoteIndex = anecdotes.indexOf(anecdote)

          return (
            <li key={index}>
              {anecdote} - has {votes[anecdoteIndex]} votes
              <button onClick={() => handleVotes(anecdoteIndex)}>Vote</button>
            </li>
          )
        })}
      </ul>

    </div>
  )
}

export default AnecdoteList