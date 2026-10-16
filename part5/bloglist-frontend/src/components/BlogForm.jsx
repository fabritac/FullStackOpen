import { useState } from 'react'

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
    <div className="blog-form">
      <form onSubmit={addBlog}>
        <div className="form-field">
          <label>
            title
            <input type="text" value={newBlog} onChange={({ target }) => setNewBlog(target.value)} />
          </label>
        </div>
        <div className="form-field">
          <label>
            author
            <input type="text" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
          </label>
        </div>
        <div className="form-field">
          <label>
            url
            <input type="text" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
