
import { validate as validateEmail } from 'email-validator'
import UsersModel from '../models/Users.js'


export function RegisterController(req, res) {
    res.render('register')
}

export async function PostRegisterController(req, res) {
    try {
        const password = req.body.password, confPassword = req.body.password_confirm;
        const email = req.body.email,emailValidated = validateEmail(email),emailUser = await UsersModel.find({"email":email});
        console.log(emailUser.length)
        if (!emailValidated) {
            res.status(400).send('<h1>Erreur - Email invalide</h1>')
            return
        }
        if (emailUser.length>0) {
            res.status(400).send('<h1>Erreur - Email déjà utilisé</h1>')
            return
        }

        if (password !== confPassword) {
            res.status(400).send('<h1>Erreur - Les champs mots de passe ne sont pas identiques</h1>')
            return
        }

        try {
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                password: password
            }

            const doc = await UsersModel.create(newUser);
            req.session.user={
                email:email
            }
            console.log(doc)
            res.redirect('dashboard')
        } catch (err) {
            console.error('Erreur d\'insertion', err.message);
        }
    } catch (err) {
        console.error('Erreur d\'insertion', err.message);

    }
}
