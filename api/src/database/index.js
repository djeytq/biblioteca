const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // Substitua pelo seu usuário do PostgreSQL
    host: 'localhost', // Ou o host do seu banco de dados
    database: 'biblioteca', // Substitua pelo nome do seu banco de dados
    password: '0000', // Substitua pela sua senha
    // port: 5432, // Porta padrão do PostgreSQL
});

pool.on('connect', () => {
    console.log('Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Erro no banco de dados:', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),pool
};