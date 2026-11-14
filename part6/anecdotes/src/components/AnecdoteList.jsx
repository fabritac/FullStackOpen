import { useStoreActions, useAnecdotes } from '../store'

const AnecdoteList = () => {
  const { handleVotes, removeAnecdote } = useStoreActions()
  const { anecdotes } = useAnecdotes()

  const anecdotesSorted = anecdotes.toSorted((a, b) => b.votes - a.votes)



  return (
    <div>
      <h1>Anecdotes</h1>
      <ul>
        {anecdotesSorted.map((anecdote) => {
          return (
            <li key={anecdote.id}>
              {anecdote.content} - has {anecdote.votes} votes
              <button onClick={() => handleVotes(anecdote.id)}>Vote</button>
              {anecdote.votes === 0 && (
                <button onClick={() => removeAnecdote(anecdote.id)}>Remove</button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AnecdoteList