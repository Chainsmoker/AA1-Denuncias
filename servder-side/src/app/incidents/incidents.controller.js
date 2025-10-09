export default class IncidentsController {
    constructor(incidentsService) {
        this.incidentsService = incidentsService;
    }

    async denuncias(req, res) {
        res.render("incidents/l-incidents", { title: "Denuncias" });
    }

    async map(req, res) {
        res.render("incidents/r-map", { title: "Mapa de Calor" });
    }
}
