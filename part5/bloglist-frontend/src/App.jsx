import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate, useParams,
} from 'react-router-dom'
import { NotificationError, NotificationSuccess } from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const BlogDetails = ({ blogs, user, onLike, onRemove }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => String(blog.id) === id)

  if (!blog) {
    return <p>blog not found</p>
  }

  return (
    <Blog
      blog={blog}
      user={user}
      onLike={onLike}
      onRemove={onRemove}
    />
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginUser = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage('login successful')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(previousBlogs => previousBlogs.concat(returnedBlog))
      setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLike = async (blogObject) => {
    if (!user) {
      return
    }

    try {
      const updatedBlog = {
        ...blogObject,
        likes: blogObject.likes + 1,
      }
      const returnedBlog = await blogService.update(blogObject.id, updatedBlog)
      setBlogs(previousBlogs => previousBlogs.map(blog =>
        blog.id === returnedBlog.id
          ? { ...blog, likes: returnedBlog.likes }
          : blog
      ))
    } catch {
      setErrorMessage('error liking blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)
      setBlogs(previousBlogs => previousBlogs.filter(blog => blog.id !== blogObject.id))
      setSuccessMessage(`blog ${blogObject.title} by ${blogObject.author} removed`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('error removing blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          loginUser={loginUser}
        />
      </Togglable>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
      {user ? (
        <div>
          <Link style={padding} to="/blogs">blogs</Link>
          <button onClick={handleLogout}>logout</button>
        </div>
      ) : (
        <div>
          <Link style={padding} to="/blogs">blogs</Link>
          <Link style={padding} to="/login">login</Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/blogs" replace />} />
        <Route path="/blogs" element={
          <div>
            <h2>blogs</h2>
            <NotificationError message={errorMessage} />
            <NotificationSuccess message={successMessage} />
            {user ? (
              <div>
                {blogForm()}
                <ul>
                  {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
                    <li key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <ul>
                  {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
                    <li key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        }/>
        <Route path="/blogs/:id" element={
          <BlogDetails
            blogs={blogs}
            user={user}
            onLike={addLike}
            onRemove={handleRemove}
          />
        } />
        <Route path="/login" element={user ? <Navigate to="/blogs" replace /> : (
          <div>
            <h2>Login</h2>
            <NotificationError message={errorMessage} />
            {loginForm()}
          </div>
        )} />
      </Routes>
    </Router>
  )
}

export default App