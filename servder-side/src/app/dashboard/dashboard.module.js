import DashboardController from "./dashboard.controller.js";
import DashboardService from "./dashboard.service.js";

const dashboardController = new DashboardController(new DashboardService());

export {
    dashboardController
}