const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
        this.profileNavLink = page.locator('text=View Profile');
        this.dashboardNavLink = page.locator('text="Dashboard"');
        this.requestsNavLink = page.locator('text=Requests');
        this.bookingsNavLink = page.locator('text=My Bookings');
        this.logoutButton = page.locator('text=Logout');

        this.searchLocationInput = page.locator('input[placeholder="Search location..."]');
        this.postRideButton = page.locator('text=+ Post a Ride');
        
        this.profileEmailText = page.locator('text=Email: test@szabist.pk');
        this.incomingRequestsHeader = page.locator('h1:has-text("Incoming Ride Requests")');
        this.myBookingsHeader = page.locator('h1:has-text("My Bookings")');
    }

    async goToProfile() {
        await this.clickElement(this.profileNavLink);
    }

    async goToRequests() {
        await this.clickElement(this.requestsNavLink);
    }

    async goToBookings() {
        await this.clickElement(this.bookingsNavLink);
    }

    async searchRide(location) {
        await this.fillInput(this.searchLocationInput, location);
    }

    async logout() {
        await this.clickElement(this.logoutButton);
    }
}

module.exports = { DashboardPage };