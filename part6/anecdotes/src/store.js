import { create } from 'zustand'
import anecdotesService from './services/anecdotes'

const initialState = {
  anecdotes: [],
  filter: '',
  notification: null
}

let notificationTimeout

const useStore = create((set) => ({
  ...initialState,
  actions: {
    handleVotes: async (anecdoteId) => {
      try {
        const anecdote = useStore.getState().anecdotes.find(({ id }) => id === anecdoteId)
        if (!anecdote) return

        const updatedAnecdote = await anecdotesService.update({
          ...anecdote,
          votes: anecdote.votes + 1
        })

        set((state) => ({
          anecdotes: state.anecdotes.map((current) =>
            current.id === updatedAnecdote.id ? updatedAnecdote : current
          )
        }))
        useStore.getState().actions.showNotification(`You voted for "${anecdote.content}"`, 'success')
      } catch (error) {
        useStore.getState().actions.showNotification(error.message, 'error')
      }
    },
    addAnecdote: async (content) => {
      try {
        const newAnecdote = await anecdotesService.create(content)

        set((state) => ({
          anecdotes: [...state.anecdotes, newAnecdote]
        }))
        useStore.getState().actions.showNotification(`"${content}" has been added`, 'success')
      } catch (error) {
        useStore.getState().actions.showNotification(error.message, 'error')
      }
    },
    setFilter: (filter) => set({ filter }),
    initializeAnecdotes: (anecdotes) => set({ anecdotes }),
    showNotification: (message, type) => {
      clearTimeout(notificationTimeout)
      set({ notification: { message, type } })
      notificationTimeout = setTimeout(() => set({ notification: null }), 5000)
    }
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useStoreState()
  const filter = useFilter()

  return {
    anecdotes: anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    ),
    filter
  }
}

export const useStoreState = () => useStore(state => state.anecdotes)
export const useStoreActions = () => useStore(state => state.actions)
export const useFilter = () => useStore(state => state.filter)
export const useNotification = () => useStore(state => state.notification)