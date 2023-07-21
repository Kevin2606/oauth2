import express from 'express';
import session from 'express-session';
import passportHelper from './helpers/passportHelper.js';
import authRouter from './routers/authRouter.js';
import checkAuthentication from './helpers/authentication.js';

const app = express();

app.use(express.json());
app.use(session({
    secret: 'secreto', // Esta clave secreta debería estar en un archivo de configuración
    resave: false, // No vuelve a guardar si no hay cambios
    saveUninitialized: false // No guarda una sesión si no hay datos
}))
app.use(passportHelper.initialize()); // Inicializa passport
app.use(passportHelper.session()); // Permite que passport use "express-session" para almacenar la sesión del usuario

app.use(express.static('public'))


app.get('/', (req, res) => res.redirect('/login'));
app.use('/login', authRouter);
app.get('/dashboard', checkAuthentication,  (req, res) => {res.sendFile('dashboard.html', { root: './public' })});


app.listen(3000, () => {
    console.log('Example app listening on http://localhost:3000');
});