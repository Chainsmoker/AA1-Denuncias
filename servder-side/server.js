import express from 'express';
import { engine as expressHbs } from 'express-handlebars'
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// routes
import dashboardRouter from './src/app/dashboard/routes/dashboard.router.js';
import authRouter from './src/app/auth/routes/auth.router.js';
import usersRouter from './src/app/users/routes/users.router.js';
import incidentsRouter from './src/app/incidents/routes/incidents.router.js';
import chatRouter from './src/app/chat/routes/chat.router.js';
import accountsRouter from './src/app/accounts/router/accounts.router.js';

const app = express();
const __filename  = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.set('views', [
    path.join(__dirname, 'src/views'),
]);

app.engine('hbs', expressHbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    partialsDir: path.join(__dirname, 'src/views/partials'),
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/dashboard", dashboardRouter, usersRouter, incidentsRouter, chatRouter, accountsRouter);
app.use("/accounts", authRouter);

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.use((req, res, next) => {
    res.status(404).render('404', { title: '404 - Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: '500 - Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});