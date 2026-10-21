import { render } from '@testing-library/react'
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

  it('renders the full blog details by default', () => {
    const { container, getByText } = render(<Blog blog={blog} />)
    const title = container.querySelector('h2.blog-title')

    expect(title).toHaveTextContent('Test Blog')
    expect(container.querySelector('.blog-author')).toHaveTextContent('Test Author')
    expect(container.querySelector('.blog-url')).toHaveTextContent('https://test.com')
    expect(container.querySelector('.blog-likes')).toHaveTextContent('likes 5')
    expect(getByText('added by Blog Creator')).toBeVisible()
    expect(getByText('view')).toBeNull()
    expect(getByText('hide')).toBeNull()
  })

  it('calls the onLike function twice when the like button is clicked twice', async () => {
    const mockOnLike = vi.fn()
    const { getByText } = render(
      <Blog blog={blog} user={{ username: 'reader' }} onLike={mockOnLike} />
    )
    const likeButton = getByText('like')
    await likeButton.click()
    await likeButton.click()

    expect(mockOnLike).toHaveBeenCalledTimes(2)
  })

  it('hides the like button when no user is logged in', () => {
    const { queryByText } = render(<Blog blog={blog} />)

    expect(queryByText('like')).toBeNull()
  })

  it('shows the remove button only to the user who added the blog', () => {
    const { queryByText, rerender } = render(
      <Blog blog={blog} user={{ username: 'other' }} />
    )
    expect(queryByText('remove')).toBeNull()

    rerender(<Blog blog={blog} user={{ username: 'creator' }} />)
    expect(queryByText('remove')).toBeVisible()
  })

})