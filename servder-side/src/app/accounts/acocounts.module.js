import AccountsController from "./accounts.controller.js";
import AccountsService from "./accounts.service.js";

const accountsController = new AccountsController(new AccountsService());

export {
    accountsController
}