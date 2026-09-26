import { test, expect } from '@playwright/test';

const USERS = [
  { email: 'admin@trialorbit.com', password: 'Admin@12345', role: 'ADMIN', badge: 'AdminDashboard' },
  { email: 'pi@trialorbit.com', password: 'PI@12345', role: 'PI', badge: 'PiDashboard' },
  { email: 'coordinator@trialorbit.com', password: 'Coordinator@12345', role: 'COORDINATOR', badge: 'CoordinatorDashboard' },
  { email: 'monitor@trialorbit.com', password: 'Monitor@12345', role: 'MONITOR', badge: 'MonitorDashboard' },
  { email: 'ethics@trialorbit.com', password: 'Ethics@12345', role: 'ETHICS', badge: 'EthicsDashboard' },
  { email: 'pv@trialorbit.com', password: 'PV@12345', role: 'PHARMACOVIGILANCE', badge: 'PvDashboard' },
  { email: 'regulator@trialorbit.com', password: 'Regulator@12345', role: 'REGULATOR', badge: 'RegulatorDashboard' }
];

test.describe('Dashboard Roles Test', () => {
  for (const user of USERS) {
    test(`Login and verify ${user.role} dashboard`, async ({ page }) => {
      // Catch console errors
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto('http://localhost:5174/login');
      
      // Attempt login
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');

      // Wait for dashboard
      await page.waitForURL('**/dashboard');
      
      // Wait for layout to settle
      await page.waitForSelector('.dashboard-layout', { state: 'visible', timeout: 5000 });

      // Take a screenshot for visual proof
      await page.screenshot({ path: `../test-results/${user.role}_dashboard.png`, fullPage: true });

      // Ensure no horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow, 'Horizontal overflow detected').toBeFalsy();

      // Ensure no errors occurred
      expect(errors.length, `Console errors found: ${errors.join(', ')}`).toBe(0);

      // Success if we reached here
      console.log(`${user.role} Dashboard verified successfully!`);
    });
  }
});
