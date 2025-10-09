export default class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }

    async myAccount(req, res) {
        res.render('accounts/r-my-profile', { title: 'Mi Perfil' });
    }

    async editAccount(req, res) {
        res.render('accounts/u-account-settings', { title: 'Editar Cuenta' });
    }

    async changePassword(req, res) {
        res.render('accounts/u-change-password', { title: 'Cambiar Contraseña' });
    }
}