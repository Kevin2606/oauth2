import { Router } from "express";
import passportHelper from "../helpers/passportHelper.js";

const router = Router();

router.get('/', (req, res) => {
    res.sendFile('login.html', { root: './public' })
})
router.get('/logout', (req, res) => {
    req.logout({}, err => console.log(err));
    res.redirect('/login');
})

router.get('/google', passportHelper.authenticate('google', { scope: ['email'] }))
router.get('/google/callback', passportHelper.authenticate('google', { failureRedirect: '/login', successRedirect: '/dashboard'}))

router.get('/facebook', passportHelper.authenticate('facebook', { scope: ['email'] }))
router.get('/facebook/callback', passportHelper.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/dashboard'}))

router.get('/twitter', passportHelper.authenticate('twitter', { scope: ['email'] }))
router.get('/twitter/callback', passportHelper.authenticate('twitter', { failureRedirect: '/login', successRedirect: '/dashboard'}))

export default router;