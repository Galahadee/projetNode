import UsersModel from '../models/Users.js'
import argon2 from "argon2"

export function LoginController(req, res) {
    res.render('login')
}

export async function PostLoginController(req, res) {
    try {
        const password = req.body.password, email = req.body.email;

        if (!password || !email) {
            req.flash('error', 'Tous les champs sont obligatoires !');
            res.redirect(`login`)
            return
        }

        const currUser = await UsersModel.findOne({ "email": email });

        if (!currUser) {
            req.flash('error', 'Email invalide !');
            res.redirect(`login`)
            return
        }

        if (await argon2.verify(currUser.password,password)) {
            req.session.user={
                email:email,
                firstName:currUser.firstName,
                lastName:currUser.lastName
            }
            res.redirect('dashboard')
            return
        }else{
            req.flash('error', 'Mot de passe invalide !');
            res.redirect('login')
            return
        }
    } catch (err) {
        console.error("Erreur connexion",err.message);
    }

}

export function LogoutController(req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send(`<h1>Erreur !</h1><p>${err.message}</p>`)
            return
        }
        req.flash('info', 'Vous avez été déconnecté.');
        res.redirect('login')
    })
}