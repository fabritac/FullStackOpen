import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: newAuthor,
      url: newUrl,
    })
    setNewBlog('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2> Create a new blog</h2>

      <form onSubmit={addBlog}>
        <TextField style={{ marginTop: 10 }}
          label="title"
          value={newBlog} onChange={({ target }) => setNewBlog(target.value)} 
          />
          <br></br>
          <TextField style={{ marginTop: 10 }}
          label="author"
          value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} 
          />
          <br></br>
          <TextField style={{ marginTop: 10 }}
          label="url"
          value={newUrl} onChange={({ target }) => setNewUrl(target.value)} 
          />
          <div>
            <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
              create
            </Button>
          </div>
      </form>
    </div>
  )
}

export default BlogForm
