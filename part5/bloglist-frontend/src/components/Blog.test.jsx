import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5,
    user: {
      name: 'Blog Creator',
      username: 'creator'
    }
  }

  it('shows blog information and likes to unauthenticated users without buttons', () => {
    const { container } = render(<Blog blog={blog} />)

    expect(screen.getByRole('heading', { name: 'Test Blog' })).toBeVisible()
    expect(container.querySelector('.blog-author')).toHaveTextContent('Test Author')
    expect(container.querySelector('.blog-url')).toHaveTextContent('https://test.com')
    expect(container.querySelector('.blog-likes')).toHaveTextContent('likes 5')
    expect(screen.getByText('added by Blog Creator')).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows only the like button to an authenticated user who did not create the blog', () => {
    render(<Blog blog={blog} user={{ username: 'reader' }} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('shows the like and delete buttons to the blog creator', () => {
    render(<Blog blog={blog} user={{ username: 'creator' }} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})