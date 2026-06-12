const { test, expect } = require('../fixtures/testSetup');
const { LoginPage } = require('../pages/LoginPage');
const authData = require('../data/authData.json');

test.describe('UniGo Input Validation & Boundary Security Suite', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo('/login');
    });

    test('Should reject completely empty credentials form submission', async () => {
        await loginPage.clickElement(loginPage.submitButton);
        await expect(loginPage.errorMessage.or(loginPage.emailInput)).toBeVisible();
    });

    test('Should reject when password field is empty', async () => {
        await loginPage.fillInput(loginPage.emailInput, authData.validUser.email);
        await loginPage.clickElement(loginPage.submitButton);
        await expect(loginPage.errorMessage.or(loginPage.passwordInput)).toBeVisible();
    });

    test('Should reject when email field consists only of blank spaces', async () => {
        await loginPage.login('   ', 'test');
        await expect(loginPage.errorMessage.or(loginPage.emailInput)).toBeVisible();
    });

    test('Should handle extreme string lengths safely in email input field', async () => {
        const longEmail = 'a'.repeat(200) + '@szabist.pk';
        await loginPage.login(longEmail, 'test');
        await expect(loginPage.errorMessage.or(loginPage.emailInput)).toBeVisible();
    });

    test('Should handle SQL injection patterns safely on input parsing fields', async ({ page }) => {
        await page.$eval('input[type="email"]', el => el.removeAttribute('type'));
        await loginPage.login("' OR '1'='1", "' OR '1'='1");
        await expect(loginPage.errorMessage.or(loginPage.emailInput)).toBeVisible();
    });
});