const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (name, email, password) => {
const hashedPassword = await bcrypt.hash(password, 10);

const result = await pool.query(
`INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
[name, email, hashedPassword]
);

return result.rows[0];
};

const login = async (email, password) => {
const result = await pool.query(
'SELECT * FROM users WHERE email = $1',
[email]
);

if (result.rows.length === 0) {
throw new Error('User not found');
}

const user = result.rows[0];

const valid = await bcrypt.compare(
password,
user.password
);

if (!valid) {
throw new Error('Invalid password');
}

const token = jwt.sign(
{
userId: user.id,
email: user.email
},
process.env.JWT_SECRET,
{
expiresIn: '7d'
}
);

return {
token
};
};

module.exports = {
register,
login
};
