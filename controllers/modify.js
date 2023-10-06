
import { validate as validateEmail } from 'email-validator'
import UsersModel from '../models/Users.js'
import argon2 from "argon2";

export default async function modifController(req, res) {
    try {
        const password = req.body.password, confPassword = req.body.password_confirm, lastName = req.body.lastName, firstName = req.body.firstName,
            email = req.body.email;

        let newUser = {}, error = false;

        const emailUser = await UsersModel.findOne({ "email": email }), emailValidated = validateEmail(email);
        if (email) {
            if (!emailValidated) {
                error = true;
                req.flash('error', 'Email invalide !');
            } else if (emailUser) {
                error = true;
                req.flash('error', 'Email déjà utilisé !');
            } else {
                req.session.user = {
                    ...req.session.user,
                    email: email
                };
                newUser = { ...newUser, email: email }
                req.flash('success', 'Email enregistré.')
            }
        }

        if (password) {
            if (password !== confPassword) {
                error = true;
                req.flash('error', 'Les champs mots de passe ne sont pas identiques!');
            } else {
                const hashPass = await argon2.hash(password);
                newUser = { ...newUser, password: hashPass };
                req.flash('success', "Mot de passe enregistré.")
            }
        }

        if (lastName) {
            req.session.user = {
                ...req.session.user,
                lastName: lastName
            }
            newUser = { ...newUser, 'lastName': lastName }
            req.flash('success', "Nom Changé.")
        }

        if (firstName) {
            req.session.user = {
                ...req.session.user,
                firstName: firstName
            }
            newUser = { ...newUser, 'firstName': firstName }
            req.flash('success', "Prénom Changé.")
        }

        if (Object.keys(newUser).length === 0 && error === false) {
            req.flash('error', "Champs vides.")
        } else {
            try {
                await UsersModel.findOneAndUpdate({ email: req.session.user.email }, newUser);
            } catch (err) {
                console.error('Erreur d\'insertion', err.message);
            }
        }
        res.redirect('dashboard')
    } catch (err) {
        console.error('Erreur Inscription', err.message);

    }
}
