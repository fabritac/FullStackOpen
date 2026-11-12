import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { useStoreActions } from './store'
import Filter from './components/Filter'
import { useEffect } from 'react'
import anecdotesService from './services/anecdotes'

const App = () => {
  const { initializeAnecdotes } = useStoreActions()

  useEffect(() => {
    anecdotesService.getAll()
      .then(initializeAnecdotes)
      .catch(error => console.error('Error fetching anecdotes:', error))
  }, [initializeAnecdotes])

  return (
    <div>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App