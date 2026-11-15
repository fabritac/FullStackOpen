const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnecdote),
  })
  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  return await response.json()
}

export const updateAnecdote = async (updatedAnecdote) => {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnecdote),
    }
    const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, options)
    if (!response.ok) {
        throw new Error('Failed to update anecdote')
    }
    return await response.json()
}