class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(path) {
        await this.page.goto(path);
    }

    async clickElement(locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fillInput(locator, text) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }

    async waitForCondition(locator, state = 'visible') {
        await locator.waitFor({ state });
    }
}

module.exports = { BasePage };