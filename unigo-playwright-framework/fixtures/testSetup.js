const { test: base, expect } = require('@playwright/test');
const { attachScreenshotAfterEach } = require('../utilities/screenshot');

const test = base.extend({
    pageSetup: [async ({ page }, use) => {
        await use();
    }, { auto: true }]
});

test.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotAfterEach(page, testInfo);
});

module.exports = { test, expect };