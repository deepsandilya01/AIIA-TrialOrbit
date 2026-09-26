import { test, expect } from '@playwright/test';

const ROLES = [
  'PI',
  'COORDINATOR',
  'MONITOR',
  'ETHICS',
  'PHARMACOVIGILANCE',
  'ADMIN',
  'REGULATOR'
];

test.describe('AIIA TrialOrbit RBAC & Responsive E2E Suite', () => {

  ROLES.forEach(role => {
    test(`Login and Dashboard Scope for ${role}`, async ({ page, isMobile }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Click role preset
      await page.click(`button.preset-chip:has-text("${role}")`);
      
      // Submit login
      await page.click('button[type="submit"]');

      // Verify successful navigation to dashboard
      await page.waitForSelector('.app-header');
      const headerBox = await page.locator('.app-header').boundingBox();
      expect(headerBox.y).toBe(0); // Sticky navbar check

      if (isMobile) {
        await page.click('button.mobile-menu-btn');
        await page.waitForSelector('.sidebar.mobile-open', { state: 'visible' });
      }

      const sidebarText = await page.locator('.sidebar').innerText();
      
      if (role === 'REGULATOR') {
        expect(sidebarText).not.toContain('Users');
        
        await page.click('a[href="/studies"]');
        await page.waitForSelector('.studies-page');
        const initializeStudyButton = page.locator('text="Initialize Study"');
        await expect(initializeStudyButton).toHaveCount(0); 

        // Attempt a backend mutation directly using page.request
        const token = await page.evaluate(() => localStorage.getItem('ctms_token'));
        const response = await page.request.post('http://localhost:3000/api/v1/studies', {
          headers: { 'Authorization': `Bearer ${token}` },
          data: { title: 'Hack Trial' }
        });
        expect(response.status()).toBe(403); 
        
        const getRes = await page.request.get('http://localhost:3000/api/v1/studies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(getRes.status()).toBe(200);

      } else if (role === 'ADMIN') {
        expect(sidebarText).toContain('Users');
      }

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth); 

      if (isMobile) {
        const isSidebarOpen = await page.locator('.sidebar.mobile-open').isVisible();
        if (isSidebarOpen) {
          await page.click('button.sidebar-close-btn');
          await page.waitForSelector('.sidebar.mobile-open', { state: 'hidden' });
        }
      }

      // Click user menu in header to open dropdown
      await page.click('.user-profile');
      await page.click('button:has-text("Sign Out")');
      await page.waitForURL('**/login');
    });
  });

  test('Direct URL Block Test', async ({ page }) => {
    await page.goto('/login');
    await page.click(`button.preset-chip:has-text("REGULATOR")`);
    await page.click('button[type="submit"]');
    await page.waitForSelector('.app-header');

    await page.goto('/users');
    
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('Access Restricted');
  });

});
