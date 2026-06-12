const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.emailInput = page.locator('input[type="email"], input[name="email"]');
        this.passwordInput = page.locator('input[type="password"], input[name="password"]');
        this.submitButton = page.locator('button[type="submit"], button:has-text("Login")');
        this.errorMessage = page.locator('text=/invalid|incorrect|not found|failed/i');
    }

    async login(email, password) {
        await this.fillInput(this.emailInput, email);
        await this.fillInput(this.passwordInput, password);
        await this.clickElement(this.submitButton);
    }
}

module.exports = { LoginPage };