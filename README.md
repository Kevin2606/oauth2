# Autenticacion con Oauth2.0
Creacion de autenticacion con Oauth2 utilizando la libreria [PassportJS](https://www.passportjs.org/) y [express-session](https://www.npmjs.com/package/express-session).

## Dependencias
```bash
npm i -E express dotenv express-session passport
```
> Opciones de autenticación
- Google: [Google Console Developer](https://console.cloud.google.com/)
    ```bash
    npm i -E passport-google-oauth20
    ```
- Discord: [Discord Developer](https://discord.com/developers/applications)
    ```bash
    npm i -E passport-discord
    ```
- Facebook: [Meta for Developers](https://developers.facebook.com/)
    ```bash
    npm i -E passport-facebook
    ```
- Twitter: [Twitter Developer Platform](https://developer.twitter.com/)
    ```bash
    npm i -E passport-twitter
    ```
> Dependencia de desarrollo
```bash
npm i -E -D nodemon
```
## Configuracion del packge.json
Las importaciones se manejaran con el estandar ES6 y se agrega el comando "dev" si se esta utilizando [nodemon](https://www.npmjs.com/package/nodemon).
```json
{
    ...,
    "type": "module",
    "scripts": {
        "dev": "nodemon --quiet index.js" // Si se instalo nodemon
    }
    ...,
}
```
## Configuracion de express y librerias
En el index.js o app.js
```Javascript
// index.js
import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
    secret: CLAVE_SECRETA_ENV, 
    resave: false, 
    saveUninitialized: false 
}))
```
> En app.use(session()) configuramos express para que use la libreria express-session
> - secret:  Esta opción es un parámetro obligatorio y se utiliza para firmar la cookie de sesión. La firma se utiliza para evitar la manipulación de datos de sesión en el lado del cliente
> 
> - resave: Esta opción es un booleano que indica si se debe volver a guardar la sesión en el almacén de sesiones aunque no haya habido cambios durante la solicitud. En este caso, está establecido en false, lo que significa que la sesión no se volverá a guardar en el almacenamiento si no ha sido modificada durante la solicitud. Esta opción ayuda a evitar el reemplazo innecesario de las sesiones en el almacén y mejora el rendimiento.
>
> - saveUninitialized: También es un booleano que indica si se debe guardar una sesión vacía en el almacén de sesiones antes de que el usuario haya interactuado con la solicitud. En este caso, está establecido en false, lo que significa que no se creará una sesión hasta que haya alguna modificación en ella (por ejemplo, cuando se establezcan datos en la sesión). Esta opción es útil para evitar el almacenamiento innecesario de sesiones para usuarios que no las utilizan.
>
### Configuracion de passport
En la carpeta helpers, creamos un nuevo archivo javascript, en este caso lo llamaremos "passportHelper", importamos passport y la opcion de autenticación que hayamos escogido, en este caso Google.
```Javascript
// passportHelper.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

passport.use(
    new GoogleStrategy(
        {
            clientID: CLIENTE_ID_GOOGLE_ENV,
            clientSecret: CLIENTE_SECRET_GOOGLE_ENV,
            callbackURL: CALLBACK_GOOGLE_URL
        },
        (accessToken, refreshToken, profile, done) => done(null, profile);
    )
);
passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export default passport;
```
En la primera parte del codigo, passport.use() se utiliza para configurar y definir una estrategia de autenticacion, en este proyecto se esta utilizando la estrategia de autenticacion con Google.
```Javascript
passport.use(new GoogleStrategy(options: StrategyOptions, verify: VerifyFunction))
```
Explicación de los parámetros:

- GoogleStrategy: Es una clase que implementa la estrategia de autenticación de Google. Passport tiene diferentes estrategias para diferentes proveedores de autenticación, como Google, Facebook, Twitter, etc.

- options: Es un objeto que contiene las opciones de configuración para la estrategia. Estas opciones varían según la estrategia específica que se esté utilizando (en este caso, GoogleStrategy). Las opciones pueden incluir credenciales de cliente de Google (como el Client ID y el Client Secret) y las URL de redireccionamiento después de la autenticación.

- verify: Es una función de verificación (también llamada "callback de verificación") que se ejecutará cuando un usuario haya sido autenticado con éxito mediante la estrategia de Google. La función toma diferentes argumentos dependiendo de la estrategia utilizada, pero en general, recibe datos de autenticación (como tokens de acceso, información del perfil del usuario, etc.) y realiza acciones personalizadas para manejar o almacenar esa información en la base de datos del usuario de la aplicación.

> En options: 
> - clientID: Es el ID de cliente proporcionado por Google para identificar tu aplicación en el proceso de autenticación.
> 
> - clientSecret: Es la clave secreta proporcionada por Google para autenticar y asegurar las comunicaciones entre tu aplicación y el servidor de autenticación de Google.
> 
>  - callbackURL: Es la URL a la que Google redirigirá al usuario después de que se complete el proceso de autenticación en el lado de Google. Esta URL debe corresponder a un endpoint en tu aplicación donde Passport procesará la respuesta de autenticación y realizará las acciones necesarias para autenticar al usuario en tu sistema.
>
> [Google Console Developer](https://console.cloud.google.com/) para obtener clientID y clientSecret

> En verify: (Funcion de verificación)
> - Esta función se ejecutará cuando un usuario haya sido autenticado con éxito por Google y se haya obtenido un token de acceso (accessToken) y posiblemente un token de actualización (refreshToken), junto con el perfil del usuario (profile).
> - En este caso, la función simplemente llama a la función done para indicar que la autenticación ha sido exitosa y pasa el perfil del usuario (profile) como el resultado. El perfil del usuario contiene información sobre el usuario autenticado, como su ID, nombre, correo electrónico, etc.
> 
> En un escenario real, es probable que esta función de verificación realice acciones adicionales, como buscar o crear un usuario local en la base de datos con la información del perfil de Google, y luego llamar a done con los detalles del usuario local. De esta manera, Passport podrá mantener la sesión de usuario y permitir que la aplicación autentique y autorice al usuario en futuras solicitudes.

Ahora para passport.serializeUser() y passport.deserializeUser()

```Javascript
passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));
```
- passport.serializeUser: Esta función se utiliza para tomar el objeto de usuario (que generalmente es el resultado de la función de verificación) y lo serializa para almacenarlo en la sesión.
- passport.deserializeUser: Esta función se utiliza para recuperar la información del usuario almacenada en la sesión y convertirla de nuevo en un objeto de usuario completo que puede ser utilizado en las solicitudes posteriores.

### Uso de passportHelper en index.js
```Javascript
// index.js

//Otras importaciones
...
import passportHelper from './helpers/passportHelper.js';

//Configuracion anterior
...
app.use(passportHelper.initialize()); // Inicializa passport
app.use(passportHelper.session()); // Permite que passport use "express-session" para almacenar la sesión del usuario

//Endpoints de autenticacion
app.get("/login/google", passportHelper.authenticate('google', { scope: ['email'] }));
app.get("/google/callback", passportHelper.authenticate('google', 
{ 
    failureRedirect: '/login/google',
    successRedirect: '/saludo'
}));
app.get("/logout", (req, res) => {
    req.logout({}, err => console.log(err));
    res.redirect('/login/google');
});

//Middleware para comprobar si esta autenticado
const checkAuthentication = (req, res, next) =>
        req.isAuthenticated() ? next() : res.redirect("/login/google");

app.get("/saludo", checkAuthentication, (req, res) => res.send("Bienvenido"))

app.listen(PORT_ENV, () => {
    console.log(`Example app listening on http://localhost:${PORT_ENV}`);
});
```
### Autenticacion

```javascript
app.get("/login/google", ...);
app.get("/login/google/callback", ...);
```

En esta parte del código, se definen dos rutas en tu aplicación Express:

1. `GET /login/google`: Esta ruta se utiliza para iniciar el proceso de autenticación con Google utilizando Passport y la estrategia de autenticación de Google (`GoogleStrategy`). Cuando un usuario accede a esta ruta, Passport redirigirá al usuario a la página de inicio de sesión de Google, donde se le pedirá que autorice a tu aplicación para acceder a la información especificada en el alcance (`scope`). En este caso, el alcance se ha configurado para obtener el correo electrónico del usuario (`email`).

2. `GET /google/callback`: Esta ruta es el punto final de redirección después de que el usuario se haya autenticado correctamente con Google. Google redirigirá al usuario a esta URL, junto con un código de autorización, si la autenticación fue exitosa. Passport utilizará la estrategia de autenticación de Google nuevamente para manejar la respuesta y recuperar la información del perfil del usuario. Dependiendo del resultado de la autenticación, Passport redirigirá al usuario a diferentes rutas.

A continuación, se muestra cómo se configura Passport para manejar la autenticación en estas rutas:

```javascript
passportHelper.authenticate('google', { scope: ['email'] })
```

El método `passport.authenticate` es un middleware proporcionado por Passport que toma la estrategia de autenticación (en este caso, `'google'`) y una serie de opciones. Para la ruta `/login/google`, se está utilizando la estrategia de autenticación de Google y se le está pasando un objeto de opciones con el alcance requerido para obtener el correo electrónico del usuario.

Ahora, para la ruta `/google/callback`, se usa nuevamente `passport.authenticate`, pero con diferentes opciones:

```javascript
passportHelper.authenticate('google', 
{ 
    failureRedirect: '/login/google',
    successRedirect: '/saludo'
})
```

Aquí, se está utilizando la misma estrategia de autenticación de Google, pero ahora se proporcionan opciones adicionales:

- `failureRedirect`: Si la autenticación falla (por ejemplo, el usuario rechaza la autorización), Passport redirigirá al usuario de regreso a la ruta `/login/google`.

- `successRedirect`: Si la autenticación es exitosa y se ha obtenido el perfil del usuario, Passport redirigirá al usuario a la ruta `/saludo`.

### Logout

Se define una ruta en tu aplicación Express para manejar el proceso de "logout" o cierre de sesión. La ruta se define como `GET /logout`. Cuando un usuario accede a esta ruta, se realizarán las acciones necesarias para cerrar la sesión del usuario y luego redirigirlo a la ruta de inicio de sesión con Google (`/login/google`).

```javascript
app.get("/logout", (req, res) => {
    // Cierre de sesión del usuario
    req.logout({}, err => console.log(err));

    // Redirección a la ruta de inicio de sesión con Google
    res.redirect('/login/google');
});
```

1. `app.get("/logout", ...)`: Define una ruta para la acción de cerrar sesión, y se configura para responder a solicitudes GET en la URL `/logout`.

2. `req.logout({}, err => console.log(err))`: Aquí se realiza el cierre de sesión del usuario. El objeto `req` representa la solicitud HTTP, y Passport agrega un método llamado `logout()` a este objeto para facilitar el cierre de sesión. La función `logout()` se utiliza para eliminar cualquier información de sesión asociada con el usuario autenticado actualmente.

   En este caso, `{}` es un objeto vacío que no contiene información adicional para el cierre de sesión. Además, si ocurre algún error durante el proceso de cierre de sesión, se imprimirá el error en la consola mediante `console.log(err)`.

### Verificacion de autenticacion en endpoints protegidos

Se define una función de middleware llamada `checkAuthentication`, que se utiliza para verificar si un usuario ha sido autenticado antes de permitir el acceso a una ruta específica. Luego, esta función de middleware se aplica a la ruta `GET /saludo` para asegurarse de que solo los usuarios autenticados puedan acceder a esta ruta.

```javascript
const checkAuthentication = (req, res, next) =>
    req.isAuthenticated() ? next() : res.redirect("/login/google");
```

1. `checkAuthentication`: Esta es una función de middleware personalizada que toma tres argumentos: `req` (la solicitud HTTP), `res` (la respuesta HTTP) y `next` (la función de siguiente middleware). El propósito de esta función es verificar si el usuario está autenticado.

2. `req.isAuthenticated()`: La función `isAuthenticated()` es proporcionada por Passport y está adjunta al objeto `req` (solicitud HTTP). Esta función devuelve `true` si el usuario ha sido autenticado correctamente, lo que significa que ha iniciado sesión. En caso contrario, devuelve `false`.

3. `req.isAuthenticated() ? next() : res.redirect("/login/google")`: En esta línea, se verifica si el usuario está autenticado. Si `req.isAuthenticated()` devuelve `true`, significa que el usuario está autenticado y el middleware pasa la solicitud a la siguiente función en la cadena de middleware (`next()`). Esto permite que la solicitud continúe hacia la ruta `/saludo` y, finalmente, devuelva el mensaje "Bienvenido".

   Si `req.isAuthenticated()` devuelve `false`, significa que el usuario no está autenticado, por lo que se redirige al usuario a la ruta de inicio de sesión con Google (`/login/google`). Esto garantiza que solo los usuarios autenticados puedan acceder a la ruta `/saludo`.

Luego, se define la ruta `GET /saludo` y se aplica el middleware `checkAuthentication` antes de manejar la solicitud:

```javascript
app.get("/saludo", checkAuthentication, (req, res) => res.send("Bienvenido"));
```

1. `app.get("/saludo", ...)`: Define la ruta `GET /saludo`.

2. `checkAuthentication`: Aquí se aplica el middleware `checkAuthentication` que hemos definido anteriormente. Esto significa que antes de manejar la solicitud en la ruta `/saludo`, se ejecutará la función de middleware `checkAuthentication`.

3. `(req, res) => res.send("Bienvenido")`: Si el middleware `checkAuthentication` permite que la solicitud continúe (es decir, el usuario está autenticado), esta función de controladora (handler) se ejecutará. Simplemente envía la respuesta "Bienvenido" al usuario.

En resumen, este código asegura que solo los usuarios autenticados puedan acceder a la ruta `GET /saludo`. Si el usuario no está autenticado, se lo redirige a la ruta de inicio de sesión con Google. Si el usuario está autenticado, se muestra el mensaje "Bienvenido".

### Inicializacion del servidor

Finalmente se inicia el servidor de la aplicación Express y lo hace escuchar en un puerto específico.
```Javascript
app.listen(PORT_ENV, () => {
    console.log(`Example app listening on http://localhost:${PORT_ENV}`);
});
```
