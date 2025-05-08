const { pool } = require('../database/index.js');

class crudBook{

    async createBook(req, res) {
        const { title, author, category, description } = req.body;
        const owner= req.user.id; // Assuming the user ID is stored in req.user after authentication
        if (!title || !author || !category || !description) {
            return res.status(400).json({ message: 'Todos campos são obrigatórios.' });
        }
        try {
            const result = await pool.query('INSERT INTO books (title, author, category, description, owner) VALUES ($1, $2, $3, $4, $5)', [title, author, category, description, owner]);
            res.status(201).json({ message: 'Livro cadstrado com sucesso'});
        } catch (error) {
            console.error('Error creating book:', error);
            res.status(500).json({ message: 'Erro ao cadastrar o livro. ' });
        }
    }

    async getBooks(req, res) {
        try {
            const result = await pool.query('SELECT * FROM books');
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching books:', error);
            res.status(500).json({ message: 'Error fetching books' });
        }
    }

    async deleteBook(req, res) {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json({ message: 'Livro deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar o livro:', error);
            res.status(500).json({ message: 'Erro ao deletar o livro' });
        }
    }
}

module.exports=crudBook;