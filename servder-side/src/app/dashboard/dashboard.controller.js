export default class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }

    async dashboard(req, res) {
        res.render('dashboard/dashboard', { title: 'Dashboard' });
    }
}