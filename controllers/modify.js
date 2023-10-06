
import { validate as validateEmail } from 'email-validator'
import UsersModel from '../models/Users.js'
import argon2 from "argon2";

export default async function modifController(req, res) {
    try {
        const password = req.body.password, confPassword = req.body.password_confirm,oldPassword=req.body.old_password, lastName = req.body.lastName, firstName = req.body.firstName,
            email = req.body.email,currUserEmail=req.session.user.email;
        const currUser= await UsersModel.findOne({'email':currUserEmail});
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
                newUser = { ...newUser, "email": email }
                req.flash('success', 'Email enregistré.')
            }
        }

        if (password) {
            if(await argon2.verify(currUser.password,oldPassword) ){
                if (password !== confPassword) {
                    error = true;
                    req.flash('error', 'Les champs mots de passe ne sont pas identiques!');
                } else {
                    const hashPass = await argon2.hash(password);
                    newUser = { ...newUser, password: hashPass };
                    req.flash('success', "Mot de passe enregistré.")
                }
            } else {
                error = true;
                req.flash('error', 'Ancien mot de passe invalide !');
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
                // console.log(newUser);
                await UsersModel.findOneAndUpdate({ email: currUserEmail }, newUser);
            } catch (err) {
                console.error('Erreur d\'insertion', err.message);
            }
        }
        res.redirect('dashboard')
    } catch (err) {
        console.error('Erreur Inscription', err.message);

    }
}
