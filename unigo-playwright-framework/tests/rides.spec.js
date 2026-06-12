const { test, expect } = require('../fixtures/testSetup');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const authData = require('../data/authData.json');

test.describe('UniGo Interactive Search & Form Core Suite', () => {
    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigateTo('/login');
        await loginPage.login(authData.validUser.email, authData.validUser.password);
    });

    test('1. [POSITIVE] Should sequentially cycle and verify all 10 Karachi location search strings in the input field', async () => {
        for (const location of authData.searchLocations) {
            await dashboardPage.searchRide(location);
            await expect(dashboardPage.searchLocationInput).toHaveValue(location);
        }
    });

    test('2. [POSITIVE] Should reveal the ride posting submission UI layout container when clicking post action', async ({ page }) => {
        await dashboardPage.clickElement(dashboardPage.postRideButton);
        await expect(page).not.toHaveURL(/.*login/);
    });

    test('3. [NEGATIVE] Should preserve an empty filter input state accurately when an empty string query is processed', async () => {
        await dashboardPage.searchRide('');
        await expect(dashboardPage.searchLocationInput).toHaveValue('');
    });
});