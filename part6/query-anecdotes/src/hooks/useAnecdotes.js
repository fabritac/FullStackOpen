import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createAnecdote, updateAnecdote } from '../requests'

export const useAnecdotes = () => {
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: () => getAll(),
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
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
        },
    })

    return {
        anecdotes: result.data,
        isPending: result.isLoading,
        addAnecdote: newAnecdoteMutation.mutate,
        updateAnecdote: updateAnecdoteMutation.mutate,
    }
}