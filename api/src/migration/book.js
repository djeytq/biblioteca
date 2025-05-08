const book = `
CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    owner integer NOT NULL,
    foreign key (owner) references users(id)
);
`
module.exports = book;