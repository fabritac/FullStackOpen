import { create } from 'zustand'

const useCounterStore = create(set => ({
  counters: {
      good: 0,
      bad: 0,
      neutral: 0,
  },
  actions: {
    incrementGood: () => set(state => ({
      counters: { ...state.counters, good: state.counters.good + 1 },
    })),
    incrementBad: () => set(state => ({
      counters: { ...state.counters, bad: state.counters.bad + 1 },
    })),
    incrementNeutral: () => set(state => ({
      counters: { ...state.counters, neutral: state.counters.neutral + 1 },
    })),
  },
}))

export const useCounters = () => useCounterStore(state => state.counters)
export const useCounterControls = () => useCounterStore(state => state.actions)