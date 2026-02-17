import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('company@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page).toHaveURL('/dashboard/company');
    await expect(page.getByRole('heading', { name: /company overview/i })).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    const toggleButton = page.getByRole('button', { name: /toggle password visibility/i });
    
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should switch between company and employee login', async ({ page }) => {
    const companyTab = page.getByRole('tab', { name: 'Company' });
    const employeeTab = page.getByRole('tab', { name: 'Employee' });
    
    await expect(companyTab).toHaveAttribute('aria-selected', 'true');
    await expect(employeeTab).toHaveAttribute('aria-selected', 'false');
    
    await employeeTab.click();
    await expect(employeeTab).toHaveAttribute('aria-selected', 'true');
    await expect(companyTab).toHaveAttribute('aria-selected', 'false');
  });
});

test.describe('Registration Flow', () => {
  test('should navigate to company registration', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /register as company/i }).click();
    
    await expect(page).toHaveURL('/register/company');
    await expect(page.getByRole('heading', { name: 'Register Company' })).toBeVisible();
  });

  test('should navigate to employee registration', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /register as employee/i }).click();
    
    await expect(page).toHaveURL('/register/employee');
    await expect(page.getByRole('heading', { name: 'Register Employee' })).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Password')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    const submitButton = page.getByRole('button', { name: 'Sign In' });
    
    await expect(emailInput).toHaveAttribute('aria-required', 'true');
    await expect(passwordInput).toHaveAttribute('aria-required', 'true');
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/login');
    
    // Check for proper heading structure
    const headings = page.getByRole('heading');
    await expect(headings.first()).toHaveText('Sign In');
    
    // Check for form labels
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check for error announcements
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    // Check mobile layout
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check mobile navigation
    const mobileNav = page.getByRole('navigation');
    await expect(mobileNav).toBeVisible();
  });

  test('should be tablet responsive', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should be desktop responsive', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });
});
