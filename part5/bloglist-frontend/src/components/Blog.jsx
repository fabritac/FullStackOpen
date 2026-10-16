import { useState } from 'react'

const Blog = ({ blog, user, onLike, onRemove }) => {
  const [toggleDetails, setToggleDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: toggleDetails ? 'none' : '' }
  const showWhenVisible = { display: toggleDetails ? '' : 'none' }

  const toggleVisibility = () => {
    setToggleDetails(!toggleDetails)
  }

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible}>
        <span className="blog-title">{blog.title}</span>{' '}
        <span className="blog-author">{blog.author}</span>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <span className="blog-title">{blog.title}</span>{' '}
        <span className="blog-author">{blog.author}</span>
        <button onClick={toggleVisibility}>hide</button>
        <br />
        <span className="blog-url">{blog.url}</span>
        <br />
        <span className="blog-likes">
          likes {blog.likes} <button onClick={() => onLike(blog)}>like</button>
        </span>
        <br />
        {blog.user && <div>added by {blog.user.name}</div>}
        {blog.user?.username === user?.username && (
          <div>
            <br />
            <button onClick={() => onRemove(blog)}>remove</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog