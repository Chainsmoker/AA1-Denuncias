import UsersController from "./users.controller.js";
import UsersService from "./users.service.js";

const usersController = new UsersController(new UsersService());

export {
    usersController
}
