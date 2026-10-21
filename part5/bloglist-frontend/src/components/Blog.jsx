const Blog = ({ blog, user, onLike, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">{blog.author}</p>
      <p className="blog-url">{blog.url}</p>
      <p className="blog-likes">
        likes {blog.likes} {user && <button onClick={() => onLike(blog)}>like</button>}
      </p>
      {blog.user && <p>added by {blog.user.name}</p>}
      {blog.user?.username === user?.username && (
        <button onClick={() => onRemove(blog)}>remove</button>
      )}
    </div>
  )
}

export default Blog