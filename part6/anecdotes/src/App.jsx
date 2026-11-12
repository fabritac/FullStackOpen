import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { useNotification, useStoreActions } from './store'
import Filter from './components/Filter'
import { useEffect } from 'react'
import anecdotesService from './services/anecdotes'
import Notification from './components/Notification'

const App = () => {
  const { initializeAnecdotes, showNotification } = useStoreActions()
  const notification = useNotification()

  useEffect(() => {
    anecdotesService.getAll()
      .then(initializeAnecdotes)
      .catch(error => showNotification(error.message, 'error'))
  }, [initializeAnecdotes, showNotification])

  return (
    <div>
      {notification && <Notification {...notification} />}
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App