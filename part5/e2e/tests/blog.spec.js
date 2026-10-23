const { test, expect } = require('@playwright/test')

const baseUrl = 'http://localhost:5173'
const username = 'cguti'
const password = '123guti'
const blogTitle = 'a blog created by playwright'
const blogAuthor = username
const blogLinkName = `${blogTitle} ${blogAuthor}`

const login = async (page, user = username, userPassword = password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(user)
  await page.getByLabel('password').fill(userPassword)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(blogTitle)
  await page.getByLabel('author').fill(blogAuthor)
  await page.getByLabel('url').fill('https://playwright.example.com')
  await page.getByRole('button', { name: 'create' }).click()
  await expect(
    page.getByText(`a new blog ${blogTitle} by ${blogAuthor} added`)
  ).toBeVisible()
}

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post(`${baseUrl}/api/testing/reset`)
    expect(resetResponse.status()).toBe(204)

    const userResponse = await request.post(`${baseUrl}/api/users`, {
      data: {
        name: 'Carlos Gutierrez',
        username,
        password
      }
    })
    expect(userResponse.status()).toBe(201)

    const otherUserResponse = await request.post(`${baseUrl}/api/users`, {
      data: {
        name: 'John Doe',
        username: 'jdoe',
        password: '123doe'
      }
    })
    expect(otherUserResponse.status()).toBe(201)

    await page.goto(baseUrl)
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await login(page)

    await expect(page.getByText('login successful')).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await login(page, username, 'wrong')

    await expect(page.getByText('wrong username or password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).toHaveCount(0)
  })

  test('a new blog can be created', async ({ page }) => {
    await login(page)
    await createBlog(page)

    await expect(
      page.getByRole('link', { name: blogLinkName, exact: true })
    ).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await login(page)
    await createBlog(page)
    await page.getByRole('link', { name: blogLinkName, exact: true }).click()

    const blog = page.locator('.blog')
    await expect(blog.locator('.blog-likes')).toContainText('likes 0')
    await blog.getByRole('button', { name: 'like' }).click()
    await expect(blog.locator('.blog-likes')).toContainText('likes 1')
  })

  test('a blog can be removed', async ({ page }) => {
    await login(page)
    await createBlog(page)
    await page.getByRole('link', { name: blogLinkName, exact: true }).click()

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm')
      expect(dialog.message()).toBe(`Remove blog ${blogTitle} by ${blogAuthor}?`)
      await dialog.accept()
    })

    await page.getByRole('button', { name: 'remove' }).click()
    await expect(page.getByText('blog not found')).toBeVisible()
    await page.getByRole('link', { name: 'blogs' }).click()
    await expect(
      page.getByRole('link', { name: blogLinkName, exact: true })
    ).toHaveCount(0)
  })

  test('other user cannot remove the blog', async ({ page }) => {
    await login(page)
    await createBlog(page)

    await page.getByRole('button', { name: 'logout' }).click()
    await login(page, 'jdoe', '123doe')
    await page.getByRole('link', { name: blogLinkName, exact: true }).click()

    await expect(page.locator('.blog')).toBeVisible()
    await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
  })
})
