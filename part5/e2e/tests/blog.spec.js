
const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Carlos Gutierrez',
        username: 'cguti',
        password: '123guti'
      }
    })

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByRole('heading', { name: 'Login' });
    await expect(locator).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();
    await page.getByLabel('username').fill('cguti');
    await page.getByLabel('password').fill('123guti');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('login successful')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();
    await page.getByLabel('username').fill('cguti');
    await page.getByLabel('password').fill('wrong');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('wrong username or password')).toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click();
      await page.getByLabel('username').fill('cguti');
      await page.getByLabel('password').fill('123guti');
      await page.getByRole('button', { name: 'login' }).click();
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog'}).click()
      await page.getByLabel('title').fill('a blog created by playwright');
      await page.getByLabel('author').fill('cguti');
      await page.getByLabel('url').fill('Cguti.com');
      await page.getByRole('button', { name: 'create'}).click()
      await expect(page.getByText('a new blog a blog created by playwright by cguti added')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel('title').fill('a blog created by playwright');
        await page.getByLabel('author').fill('cguti');
        await page.getByLabel('url').fill('Cguti.com');
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('a blog can be liked', async({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'a blog created by playwright' })

        await expect(blog).toBeVisible()
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'like'}).click()

        await expect(blog.locator('.blog-likes')).toContainText('likes 1')
      })

      test('a blog can be removed', async({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'a blog created by playwright' })

        page.on('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm');
          expect(dialog.message()).toContain('Remove blog a blog created by playwright by cguti?');
          await dialog.accept(); // This clicks "OK"
        });

        await expect(blog).toBeVisible()
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'remove'}).click()

        await expect(blog).not.toBeVisible()
      })
    })

  })

});
