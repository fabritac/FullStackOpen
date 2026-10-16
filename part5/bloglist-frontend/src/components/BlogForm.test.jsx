import { fireEvent, render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  it('calls createBlog with the form data when submitted', () => {
    const mockCreateBlog = vi.fn()
    render(<BlogForm createBlog={mockCreateBlog} />)

    fireEvent.change(screen.getByLabelText('title'), {
      target: { value: 'Test Blog' }
    })
    fireEvent.change(screen.getByLabelText('author'), {
      target: { value: 'Test Author' }
    })
    fireEvent.change(screen.getByLabelText('url'), {
      target: { value: 'https://test.com' }
    })

    fireEvent.click(screen.getByRole('button', { name: 'create' }))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test.com'
    })
  })
})