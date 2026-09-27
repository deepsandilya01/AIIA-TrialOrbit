import { test, expect } from '@playwright/test';

test.describe('Button Functionality Audit - MVP Actions', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as ADMIN or PI for maximum permissions
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@aiia-ctms.in');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Export Study Dossier button triggers download', async ({ page }) => {
    await page.goto('/studies');
    // Click on the first study to go to details
    await page.click('table tbody tr:first-child td:first-child');
    await page.waitForSelector('.study-actions button:has-text("Export Dossier")');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('.study-actions button:has-text("Export Dossier")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('dossier.pdf');
  });

  test('Export Site Directory button triggers download', async ({ page }) => {
    await page.goto('/sites');
    await page.waitForSelector('button:has-text("Export Directory")');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export Directory")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('Export Safety CIOMS button triggers download', async ({ page }) => {
    await page.goto('/safety');
    await page.waitForSelector('button[title="Export CIOMS MVP Report"]');
    
    const downloadPromise = page.waitForEvent('download');
    // Click the first CIOMS button
    await page.locator('button[title="Export CIOMS MVP Report"]').first().click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('safety-event-');
  });

  test('Profile Edit updates correctly', async ({ page }) => {
    await page.goto('/profile');
    
    // Click Edit
    await page.click('button:has-text("Edit")');
    
    // Update phone
    await page.fill('input[type="text"]:has-text("Phone")', '+91 99999 88888');
    
    // Click Save
    await page.click('button:has-text("Save")');
    
    // Verify toast or updated UI
    await expect(page.locator('.toast')).toContainText('Profile updated successfully');
  });

  test('Upload Compliance Document button works', async ({ page }) => {
    await page.goto('/compliance');
    
    // Click Upload Document
    await page.click('button:has-text("Upload Document")');
    
    // Fill form
    await page.fill('input#docTitle', 'Test Protocol Update');
    await page.selectOption('select#docType', 'PROTOCOL');
    
    // Select dummy file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test pdf content')
    });
    
    // Submit
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.toast')).toContainText('Document uploaded successfully');
  });
});
