const user=`
CREATE TABLE IF NOT EXISTS users(
id serial PRIMARY KEY,
name varchar(200) not null,
email varchar(200) not null,
password varchar(250) not null
)
`;

module.exports=user;