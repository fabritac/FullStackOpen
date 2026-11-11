import { create } from 'zustand'
import { anecdotes } from './data/anecdotes'

const initialState = {
  counters: {
    votes: Array(anecdotes.length).fill(0)
  }
}

const useStore = create((set) => ({
  ...initialState,
  actions: {
    handleVotes: (anecdoteIndex) => set((state) => {
      const votes = [...state.counters.votes]
      votes[anecdoteIndex] += 1

      return {
        counters: {
          ...state.counters,
          votes
        }
      }
    }),
    addAnecdote: (anecdote) => set((state) => {
      const newAnecdote = {
        content: anecdote,
        id: Math.floor(Math.random() * 1000000),
        votes: 0
      }
      anecdotes.push(newAnecdote.content)

      return {
        counters: {
          ...state.counters,
          votes: [...state.counters.votes, 0]
        }
      }
    })
  }
}))

export const useStoreState = () => useStore(state => state.counters)
export const useStoreActions = () => useStore(state => state.actions)