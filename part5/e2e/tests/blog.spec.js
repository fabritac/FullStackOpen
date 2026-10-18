
const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByRole('heading', { name: 'Login' });
    await expect(locator).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();
    await page.getByLabel('username').fill('root');
    await page.getByLabel('password').fill('sekret');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('Superuser logged in')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();
    await page.getByLabel('username').fill('root');
    await page.getByLabel('password').fill('wrong');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('wrong username or password')).toBeVisible();
  });


});
