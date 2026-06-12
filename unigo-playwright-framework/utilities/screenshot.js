const { test } = require('@playwright/test');

async function attachScreenshotAfterEach(page, testInfo) {
    await testInfo.attach('Final Step Success Verification Screenshot', {
        body: await page.screenshot(),
        contentType: 'image/png'
    });
}

module.exports = { attachScreenshotAfterEach };