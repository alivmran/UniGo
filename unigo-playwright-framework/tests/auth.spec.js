const { test, expect } = require('../fixtures/testSetup');
const { LoginPage } = require('../pages/LoginPage');
const authData = require('../data/authData.json');

test.describe('UniGo Baseline Authentication Suite', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo('/login');
    });

    test('Should successfully log in with valid SZABIST credentials', async ({ page }) => {
        await loginPage.login(authData.validUser.email, authData.validUser.password);
        await expect(page).not.toHaveURL(/.*login/);
    });

    test('Should reject invalid baseline credentials and show error banner', async () => {
        await loginPage.login(authData.invalidUser.email, authData.invalidUser.password);
        await expect(loginPage.errorMessage).toBeVisible();
    });
});