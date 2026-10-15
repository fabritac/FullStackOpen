import { useState } from 'react'

const Blog = ({ blog, onLike }) => {
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
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={() => onLike(blog)}>like</button>
        <br />
        {blog.user && <div>added by {blog.user.name}</div>}
      </div>
    </div>
  )
}

export default Blog