import IncidentsController from "./incidents.controller.js";
import IncidentsService from "./incidents.service.js";

const incidentsController = new IncidentsController(new IncidentsService());

export {
    incidentsController
}
