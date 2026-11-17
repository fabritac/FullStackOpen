import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createAnecdote, updateAnecdote } from '../requests'
import { useNotification } from '../contexts/useNotification'

export const useAnecdotes = () => {
    const queryClient = useQueryClient()
    const { notify } = useNotification()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: () => getAll(),
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
            notify(`a new anecdote ${newAnecdote.content} created`)
        },
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(
                ['anecdotes'],
                anecdotes.map((anecdote) =>
                    anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
                )
            )
            notify(`anecdote ${updatedAnecdote.content} voted`)
        },
    })

    return {
        anecdotes: result.data,
        isPending: result.isLoading,
        addAnecdote: newAnecdoteMutation.mutate,
        updateAnecdote: updateAnecdoteMutation.mutate,
    }
}