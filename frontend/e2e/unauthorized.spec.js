import { test, expect } from '@playwright/test';

const ROLES = [
  { role: 'PI', roleLabel: 'Principal Investigator', name: 'Dr. Principal Investigator', email: 'pi@trialorbit.com', password: 'password123' },
  { role: 'COORDINATOR', roleLabel: 'Study Coordinator', name: 'Clinical Coordinator', email: 'coordinator@trialorbit.com', password: 'password123' },
  { role: 'MONITOR', roleLabel: 'Clinical Monitor (CRA)', name: 'Clinical Monitor', email: 'monitor@trialorbit.com', password: 'password123' },
  { role: 'ETHICS', roleLabel: 'Ethics Committee', name: 'Ethics Committee', email: 'ethics@trialorbit.com', password: 'password123' },
  { role: 'PHARMACOVIGILANCE', roleLabel: 'Pharmacovigilance Officer', name: 'PV Specialist', email: 'pv@trialorbit.com', password: 'password123' },
  { role: 'REGULATOR', roleLabel: 'Regulatory Authority', name: 'Regulatory Authority', email: 'regulator@trialorbit.com', password: 'password123' }
];

test.describe('Unauthorized Direct URL Access Tests', () => {
  for (const user of ROLES) {
    test(`Verify ${user.role} is blocked from /users without white screen`, async ({ page, isMobile }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Click role preset
      await page.click(`button.preset-chip:has-text("${user.role}")`);
      
      // Submit login
      await page.click('button[type="submit"]');
      
      // Wait for dashboard to load
      await page.waitForURL('**/dashboard');
      
      // 2. Direct navigate to unauthorized route
      await page.goto('/users');
      
      // 3. Verify shell is visible (Header)
      await expect(page.locator('.app-header')).toBeVisible();
      
      // 4. Verify Access Restricted UI is visible
      const forbiddenCard = page.locator('.page-container .card', { hasText: 'Access Restricted' });
      await expect(forbiddenCard).toBeVisible();
      
      // Check that the ForbiddenPage explicitly shows the user's role string inside the card
      await expect(forbiddenCard).toContainText(user.role);
      
      // 5. Test Mobile Drawer Behavior
      if (isMobile) {
         // Sidebar is hidden by default on mobile
         await expect(page.locator('.sidebar.mobile-open')).not.toBeVisible();
         
         // Open mobile menu
         await page.click('button.mobile-menu-btn');
         await expect(page.locator('.sidebar.mobile-open')).toBeVisible();
         
         // Verify role/profile text remains accessible inside the sidebar badge
         await expect(page.locator('.sidebar-role-badge')).toContainText(user.roleLabel, { ignoreCase: true });
         
         // Close sidebar
         await page.click('button.sidebar-close-btn');
         await expect(page.locator('.sidebar.mobile-open')).not.toBeVisible();
      } else {
         await expect(page.locator('.sidebar')).toBeVisible();
      }
      
      // 6. Verify the actual User list component didn't mount
      await expect(page.locator('h1:has-text("User Management")')).not.toBeVisible();
    });
  }
});
