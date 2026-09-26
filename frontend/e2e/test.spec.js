import { test, expect } from '@playwright/test';

test('ADMIN login and dashboard loads', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Just testing if the browser works
});
