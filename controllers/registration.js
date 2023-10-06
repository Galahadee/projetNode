
import { validate as validateEmail } from 'email-validator'
import UsersModel from '../models/Users.js'
import argon2 from "argon2";
import flash from "connect-flash";

export function RegisterController(req, res) {
    res.render('register')
}

export async function PostRegisterController(req, res) {
    try {
        const password = req.body.password, confPassword = req.body.password_confirm, lastName = req.body.lastName, firstName = req.body.firstName,
            email = req.body.email;


        if (!password || !confPassword || !email || !firstName || !lastName) {

            req.flash('error', 'Tous les champs sont obligatoires !');
            res.redirect('register')
            return
        }

        const emailUser = await UsersModel.findOne({ "email": email }), emailValidated = validateEmail(email);

        if (!emailValidated) {

            req.flash('error', 'Email invalide !');
            res.redirect('register')
            return
        }

        if (emailUser) {
            req.flash('error', 'Email déjà utilisé!');
            res.redirect('register')
            return
        }

        if (password !== confPassword) {
            req.flash('error', 'Les champs mots de passe ne sont pas identiques!');
            res.redirect('register')
            return
        }

        try {
            const hashPass = await argon2.hash(password);
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashPass
            };

            await UsersModel.create(newUser);
            req.flash('success', 'Vous êtes bien enregistré !');
            res.redirect('login')
        } catch (err) {
            console.error('Erreur d\'insertion', err.message);
        }
    } catch (err) {
        console.error('Erreur Inscription', err.message);

    }
}
