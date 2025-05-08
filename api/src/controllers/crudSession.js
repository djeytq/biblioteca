const { pool } = require('../database/index.js');
const bcrypt = require('bcrypt');
const { sign } = require("jsonwebtoken"); // Import JWT sign function
const AUTH = require('../config/auth.js'); // Import authentication configurations

class CrudSession {

    // Method to handle user registration
    async signUp(req, res) {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;

        try {
            // Verify if passwords match
            if (password != confirmPassword) {
                return res.json({ "message": "As senhas devem ser iguais!" });
            }

            // Check if a user with the same email already exists
            const result = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                return res.json({ "message": "Já existe um usuário com esse email!" });
            }

            // Encrypt the password
            let hashedPassword = await bcrypt.hash(password, 10);

            // Register the user
            await pool.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3)', [name, email, hashedPassword]);
            res.json({ "message": "Usuário cadastrado com sucesso!" });

        } catch (err) {
            console.log(err);
            res.json({ "message": "Erro ao cadastrar o usuário!", err });
        }
    }

    // Method to handle user login
    async signIn(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        try {
            // Check if the user exists
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            // If user not found, return an error message
            if (!user) {
                return res.json({ "message": "Email ou senha está incorreta!" });
            }
            
            // Verify the password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.json({ "message": "Email ou senha está incorreta!" });
            }
            
            // Generate a JWT token
            let payload = { id: user.id, name: user.name, email: user.email };
            let token = sign(payload, AUTH.secretKEY, { expiresIn: AUTH.expiresIn });
            console.log('chegou!!!');

            res.json({ user, token, message: "Sessão iniciada com sucesso!!!" });

        } catch (err) {
            console.log(err);
            res.json({ "message": "Erro ao realizar login!", err });
        }
    }
}

module.exports = CrudSession;