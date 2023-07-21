import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";

const authUser = (accessToken, refreshToken, profile, done) => {
//    console.log("accessToken", accessToken); // AccesToken es el token que le permite a nuestra aplicación acceder a los datos del usuario
//    console.log("refreshToken", refreshToken); // RefreshToken es el token que le permite a nuestra aplicación obtener un nuevo accessToken cuando el actual expire
//    console.log("profile", profile); // Profile es el objeto que contiene los datos del usuario
    done(null, profile);
};

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "1043140317076-o7hvp4prtmb3gogv4ju397fdvbhc5n0p.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/login/google/callback",
        },
        authUser
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: "230120676102215",
            clientSecret: '6e9bd1a20713f982987b471e7c5668e2',
            callbackURL: "http://localhost:3000/login/facebook/callback",
        },
        authUser
    )
);

passport.use(
    new TwitterStrategy(
        {
            consumerKey: "RtMerKi8N2OtqC34y43idNQf0",
            consumerSecret: "xIlSlhC71DprB5XQcsZa2J5s70gugKn1ZMe91CjIl9nP2iV18G",
            callbackURL: "http://localhost:3000/login/twitter/callback",
        },
        authUser
    )
)


passport.serializeUser((user, done) => {
    console.log("serializeUser");
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("deserializeUser");
    done(null, user);
});

export default passport;
