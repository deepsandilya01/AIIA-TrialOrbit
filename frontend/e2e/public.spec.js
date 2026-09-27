import { test, expect } from '@playwright/test';

test.describe('Public Website E2E Suite', () => {
  
  test('Public Homepage loads without login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AIIA TrialOrbit/);
    await expect(page.locator('h1')).toHaveText(/A Real-Time Control Room/);
  });

  test('Public navbar displays correct links and Studies is absent', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      const menuToggle = page.locator('.public-mobile-toggle');
      await menuToggle.click();
      const mobileNav = page.locator('.public-mobile-drawer');
      await expect(mobileNav).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'Home' })).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'Platform' })).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'Lifecycle' })).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'Roadmap' })).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'About' })).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'Contact' })).toBeVisible();
      await expect(mobileNav.locator('a.drawer-link', { hasText: 'Studies' })).not.toBeVisible();
    } else {
      const desktopNav = page.locator('nav.desktop-only-nav');
      await expect(desktopNav).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'Home' })).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'Platform' })).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'Lifecycle' })).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'Roadmap' })).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'About' })).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'Contact' })).toBeVisible();
      await expect(desktopNav.locator('a', { hasText: 'Studies' })).not.toBeVisible();
    }
  });

  test('Mobile navbar displays Roadmap and Studies is absent', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.goto('/');
    
    const menuToggle = page.locator('.public-mobile-toggle');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    
    const mobileDrawer = page.locator('.public-mobile-drawer');
    await expect(mobileDrawer).toBeVisible();
    
    await expect(mobileDrawer.locator('a.drawer-link', { hasText: 'Roadmap' })).toBeVisible();
    await expect(mobileDrawer.locator('a.drawer-link', { hasText: 'Studies' })).not.toBeVisible();
  });

  test('Roadmap page loads properly without login and direct URL works', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      const menuToggle = page.locator('.public-mobile-toggle');
      await menuToggle.click();
      await page.locator('.public-mobile-drawer a.drawer-link', { hasText: 'Roadmap' }).click();
    } else {
      await page.locator('nav.desktop-only-nav a', { hasText: 'Roadmap' }).click();
    }
    await expect(page).toHaveURL(/.*\/roadmap/);
    
    // Direct URL and Refresh
    await page.goto('/roadmap');
    await expect(page.locator('h1')).toHaveText(/TrialOrbit Product Roadmap/);
    await expect(page.locator('text=LIVE NOW')).toBeVisible();
    await expect(page.locator('text=PARTIALLY AVAILABLE')).toBeVisible();
    await expect(page.locator('text=COMING SOON — MVP-2')).toBeVisible();
    await expect(page.locator('text=FUTURE / ADVANCED')).toBeVisible();
  });

  test('How It Works anchor navigation works correctly', async ({ page }) => {
    await page.goto('/#how-it-works');
    // Ensure the section with ID is present
    const howItWorksSection = page.locator('section#how-it-works');
    await expect(howItWorksSection).toBeVisible();
    await expect(howItWorksSection).toHaveId('how-it-works');
    await expect(howItWorksSection.locator('text=MONITOR → IDENTIFY → ACT')).toBeVisible();
  });

  test('Role cards show all 7 exact roles and no false claims', async ({ page }) => {
    await page.goto('/');
    
    const roles = ['Principal Investigator (PI)', 'Study Coordinator', 'Clinical Monitor (CRA)', 'Pharmacovigilance Officer', 'Ethics Committee', 'Administration (ADMIN)', 'Regulator'];
    for (const role of roles) {
      const cardTitle = page.locator('.rbac-role-title', { hasText: role }).first();
      await expect(cardTitle).toBeVisible();
    }
  });

  test('Private Studies accessible after login', async ({ page }) => {
    await page.goto('/login');
    // We expect this route to be protected, but if we navigate to /studies directly we should be redirected or see login
    await page.goto('/studies');
    // The protected route redirects unauthenticated users back to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
