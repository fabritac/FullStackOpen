import { create } from 'zustand'
import anecdotesService from './services/anecdotes'

const initialState = {
  anecdotes: [],
  filter: ''
}

const useStore = create((set) => ({
  ...initialState,
  actions: {
    handleVotes: async (anecdoteId) => {
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
    },
    addAnecdote: async (content) => {
      const newAnecdote = await anecdotesService.create(content)

      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    setFilter: (filter) => set({ filter }),
    initializeAnecdotes: (anecdotes) => set({ anecdotes })
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