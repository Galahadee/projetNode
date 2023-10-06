
import { validate as validateEmail } from 'email-validator'
import UsersModel from '../models/Users.js'
import argon2 from "argon2";

export function RegisterController(req, res) {
    res.render('register')
}

export async function PostRegisterController(req, res) {
    try {
        const password = req.body.password, confPassword = req.body.password_confirm, lastName = req.body.lastName, firstName = req.body.firstName,
            email = req.body.email;

        const emailUser = await UsersModel.findOne({ "email": email }), emailValidated = validateEmail(email);
        let error = false;
        if (!password || !confPassword || !email || !firstName || !lastName) {
            error = true
            req.flash('error', 'Tous les champs sont obligatoires !');
        }


        if (!emailValidated) {
            error = true;
            req.flash('error', 'Email invalide !');
        }

        if (emailUser) {
            error = true;
            req.flash('error', 'Email déjà utilisé!');
        }

        if (password !== confPassword) {
            error = true;
            req.flash('error', 'Les champs mots de passe ne sont pas identiques!');
        }

        if (error == true) {
            res.redirect('register')
            return
        } else {
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
        }


    } catch (err) {
        console.error('Erreur Inscription', err.message);

    }
}
