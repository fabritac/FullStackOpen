import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    }
}))

import anecdotesService from './services/anecdotes'
import { useStore, useStoreActions } from './store'

beforeEach(() => {
    useStore.setState({
        anecdotes: [],
        filter: '',
        notification: null
    })
    vi.clearAllMocks()
})

describe('useStoreActions', () => {
    it('initializes anecdotes from the service', async () => {
        const mockAnecdotes = [
            { id: '1', content: 'Anecdote 1', votes: 0 },
            { id: '2', content: 'Anecdote 2', votes: 0 },
        ]
        anecdotesService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useStoreActions())
        await result.current.initializeAnecdotes()

        expect(useStore.getState().anecdotes).toEqual(mockAnecdotes)
    })

    it('add appends a new anecdote to the store', async () => {
        const newAnecdote = { id: '3', content: 'Anecdote 3', votes: 0 }
        anecdotesService.create.mockResolvedValue(newAnecdote)

        const { result } = renderHook(() => useStoreActions())
        await result.current.addAnecdote('Anecdote 3')

        expect(useStore.getState().anecdotes).toContainEqual(newAnecdote)
    })

    it('handleVotes increments the votes of an anecdote', async () => {
        const anecdote = { id: '1', content: 'Anecdote 1', votes: 0 }
        useStore.setState({ anecdotes: [anecdote] })
        anecdotesService.update.mockResolvedValue({ ...anecdote, votes: 1 })

        const { result } = renderHook(() => useStoreActions())
        await result.current.handleVotes(anecdote.id)

        expect(useStore.getState().anecdotes.find(a => a.id === anecdote.id).votes).toBe(1)
    })

    it('anecdotes show in order of votes', async () => {
        const anecdotes = [
            { id: '1', content: 'Anecdote 1', votes: 2 },
            { id: '2', content: 'Anecdote 2', votes: 5 },
            { id: '3', content: 'Anecdote 3', votes: 1 },
        ]
        useStore.setState({ anecdotes })

        const sortedAnecdotes = useStore.getState().anecdotes.sort((a, b) => b.votes - a.votes)

        expect(sortedAnecdotes[0].votes).toBe(5)
        expect(sortedAnecdotes[1].votes).toBe(2)
        expect(sortedAnecdotes[2].votes).toBe(1)
    })

    it('setFilter updates the filter state', () => {
        const { result } = renderHook(() => useStoreActions())
        result.current.setFilter('test filter')

        expect(useStore.getState().filter).toBe('test filter')
    })
})