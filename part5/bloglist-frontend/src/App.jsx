import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { AppBar, Container, Toolbar } from '@mui/material'
import Notification from './components/Notification'
import { Button, Typography } from '@mui/material'

import {
  Routes, Route, Link, Navigate, useParams,
  useNavigate,
} from 'react-router-dom'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

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
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

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
      setNotification({ text: `User '${user.name}' logged successful`, type: 'success'})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({ text: 'wrong username or password', type: 'error'})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/blogs')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(previousBlogs => previousBlogs.concat(returnedBlog))
      navigate('/blogs')
      setNotification({ text: `a new blog ${blogObject.title} by ${blogObject.author} added`, type: 'success'})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({ text: 'error creating blog'})
      setTimeout(() => {
        setNotification(null)
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
      setNotification('error liking blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)
      setBlogs(previousBlogs => previousBlogs.filter(blog => blog.id !== blogObject.id))
      navigate('/blogs')
      setNotification({ text: `blog ${blogObject.title} by ${blogObject.author} removed`})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification('error removing blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      {user ? (
        <div>
          <AppBar position='static'>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Blog App
              </Typography>
              <Button color="inherit" component={Link} to="/blogs" sx={style}>blogs</Button>
              <Button color="inherit" component={Link} to="/create" sx={style}>new blog</Button>
              <Button color="inherit" onClick={handleLogout} to="/blogs" sx={style}>logout</Button>
            </Toolbar>
          </AppBar>
        </div>
        
      ) : (
        <div>
          <AppBar position='static'>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Blog App
              </Typography>
              <Button color="inherit" component={Link} to="/blogs" sx={style}>blogs</Button>
              <Button color='inherit' component={Link} to="/login" sx={style}>login</Button>
            </Toolbar>
          </AppBar>
        </div>
      )}

      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={<Navigate to="/blogs" replace />} />
        <Route path='/create' element={
           <BlogForm createBlog={addBlog} />
          }/>
        <Route path="/blogs" element={
          <div>
            <h2>blogs</h2>
            {user ? (
              <div>
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
            <LoginForm loginUser={loginUser} />
          </div>
        )} />
      </Routes>
    </Container>
  )
}

export default App