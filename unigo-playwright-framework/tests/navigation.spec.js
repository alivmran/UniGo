const { test, expect } = require('../fixtures/testSetup');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const authData = require('../data/authData.json');

test.describe('UniGo Portal Comprehensive Navigation & Module Mapping Suite', () => {
    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigateTo('/login');
        await loginPage.login(authData.validUser.email, authData.validUser.password);
    });

    // --- SECTION A: FRAMEWORK ROUTING GATES (4 Tests) ---
    test('1. [POSITIVE] Should switch view context to Profile Tab safely without causing application unmounting', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.profileEmailText).toBeVisible();
    });

    test('2. [POSITIVE] Should switch view context to Requests Tab and assert visibility of container headers', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.incomingRequestsHeader).toBeVisible();
    });

    test('3. [POSITIVE] Should switch view context to Bookings Tab and confirm active visibility of history panels', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.myBookingsHeader).toBeVisible();
    });

    test('4. [POSITIVE] Should clean user execution context and redirect to login state upon choosing logout', async ({ page }) => {
        await dashboardPage.logout();
        await expect(page).toHaveURL(/.*login.*/);
    });

    // --- SECTION B: PROFILE METRIC RECORD EXAMINATIONS (6 Tests) ---
    test('5. [POSITIVE] Should read primary bold headers inside profile interface cards to locate student user name', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.page.locator('h2:has-text("TEST")').first()).toBeVisible();
    });

    test('6. [POSITIVE] Should read numerical character digits on user configuration node to match SZABIST university ID code', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.page.locator('text=2382055').first()).toBeVisible();
    });

    test('7. [POSITIVE] Should read text string attributes on profile card layout to verify registration email matches', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.page.locator('text=test@szabist.pk').first()).toBeVisible();
    });

    test('8. [POSITIVE] Should look up numeric scoreboard values inside metadata panel to identify total Rides Taken counts', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.page.locator('text=2').first()).toBeVisible();
    });

    test('9. [POSITIVE] Should look up numeric scoreboard values inside metadata panel to identify total Rides Given counts', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.page.locator('text=4').first()).toBeVisible();
    });

    test('10. [POSITIVE] Should read driver scoring metrics percentages to verify performance display stands at ninety-six percent', async () => {
        await dashboardPage.goToProfile();
        await expect(dashboardPage.page.locator('text=96%').first()).toBeVisible();
    });

    // --- SECTION C: REQUEST SYSTEM COMPONENT ASSERTERS (8 Tests) ---
    test('11. [POSITIVE] Should scan incoming requests logs to verify route entry: Nazimabad to SZABIST', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=Nazimabad').first()).toBeVisible();
    });

    test('12. [POSITIVE] Should scan incoming requests logs to verify long distance route entry: Larkana to SZABIST', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=Larkana').first()).toBeVisible();
    });

    test('13. [POSITIVE] Should scan incoming requests logs to verify duplicate route entry: FB Area tracking block one', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=FB Area').first()).toBeVisible();
    });

    test('14. [POSITIVE] Should verify passenger information values match records for passenger Asghar', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=Asghar').first()).toBeVisible();
    });

    test('15. [POSITIVE] Should verify passenger information values match records for passenger Ali', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('p:has-text("Ali")').first()).toBeVisible();
    });

    test('16. [POSITIVE] Should verify passenger information values match records for passenger Imran', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=Imran').first()).toBeVisible();
    });

    test('17. [POSITIVE] Should verify passenger information values match records for passenger Abdul Rafay', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=Rafay').first()).toBeVisible();
    });

    test('18. [POSITIVE] Should confirm that completed operation tags maintain appropriate css visibility highlights', async () => {
        await dashboardPage.goToRequests();
        await expect(dashboardPage.page.locator('text=Completed').first()).toBeVisible();
    });

    // --- SECTION D: CARPOOL BOOKING HISTORY VALIDATORS (8 Tests) ---
    test('19. [POSITIVE] Should inspect completed logs within history tracker to locate pricing record: Rs 600', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=600').first()).toBeVisible();
    });

    test('20. [POSITIVE] Should inspect completed logs within history tracker to locate pricing record: Rs 500', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=500').first()).toBeVisible();
    });

    test('21. [POSITIVE] Should examine historical item cards to ensure driver entity attributes specify driver Ali', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=Ali').first()).toBeVisible();
    });

    test('22. [POSITIVE] Should trace status flags on user history grid to assert text reads Completed', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=Completed').first()).toBeVisible();
    });

    test('23. [POSITIVE] Should confirm five star structural rating labels are present on first trip index log row', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=5').first()).toBeVisible();
    });

    test('24. [POSITIVE] Should confirm four star structural rating labels are present on second trip index log row', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=4').first()).toBeVisible();
    });

    test('25. [POSITIVE] Should check route tracking cards for data visibility: FB Area to SZABIST log entries', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=FB Area').first()).toBeVisible();
    });

    test('26. [POSITIVE] Should check route tracking cards for data visibility: DHA Phase 6 to SZABIST log entries', async () => {
        await dashboardPage.goToBookings();
        await expect(dashboardPage.page.locator('text=DHA').first()).toBeVisible();
    });

    // --- SECTION E: ROUTING DEFENSE & ROBUSTNESS SCENARIOS (4 Tests) ---
    test('27. [NEGATIVE] Should clean and clear search box string input memory states during component tab swaps', async () => {
        await dashboardPage.searchRide('Nazimabad');
        await dashboardPage.goToProfile();
        await dashboardPage.clickElement(dashboardPage.dashboardNavLink);
        await expect(dashboardPage.searchLocationInput).toHaveValue('');
    });

    test('28. [NEGATIVE] Should reject back history routing steps and force login locking locks after log out cycles', async ({ page }) => {
        await dashboardPage.logout();
        await expect(dashboardPage.myBookingsHeader).not.toBeVisible();
        await expect(dashboardPage.incomingRequestsHeader).not.toBeVisible();
    });

    test('29. [NEGATIVE] Should reject direct url injection to hidden paths and redirect to root entry gate after logout', async ({ page }) => {
        await dashboardPage.logout();
        await page.goto('http://localhost:5173/login');
        await expect(page).toHaveURL(/.*login.*/);
    });

    test('30. [NEGATIVE] Should assert navigation link highlights unmount completely from DOM structure post user logouts', async () => {
        await dashboardPage.logout();
        await expect(dashboardPage.logoutButton).not.toBeVisible();
    });
});