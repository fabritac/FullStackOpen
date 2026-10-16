import { render } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5
  }

  it('renders title and author, but hides the URL and likes by default', () => {
    const { container } = render(<Blog blog={blog} />)
    const title = container.querySelector('.blog-title')
    const author = container.querySelector('.blog-author')
    const url = container.querySelector('.blog-url')
    const likes = container.querySelector('.blog-likes')

    expect(title).toHaveTextContent('Test Blog')
    expect(title).toBeVisible()
    expect(author).toHaveTextContent('Test Author')
    expect(author).toBeVisible()
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  it('shows URL and likes when the view button is clicked', async () => {
    const { container, getByText } = render(<Blog blog={blog} />)
    const viewButton = getByText('view')
    await viewButton.click()

    const url = container.querySelector('.blog-url')
    const likes = container.querySelector('.blog-likes')

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

})