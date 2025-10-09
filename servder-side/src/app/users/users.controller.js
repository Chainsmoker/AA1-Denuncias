export default class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async users(req, res) {
        res.render('users/users', { title: 'Usuarios' });
    }
}
