const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { pool } = require('../services/db');

const signupPost = (req, res) => {
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = {
        userId: req.body.userId,
        name: req.body.name,
        password: hash
      };

      pool.connect((err, client, done) => {
        client.query('SELECT * FROM users WHERE userid=$1', [user.userId], (error, result) => {
          done();
          if (result.rows > '0') {
            user.userId += 1;
          }
        });
        const query = 'INSERT INTO users(userId, name, password) VALUES($1,$2,$3) RETURNING *';
        const values = [user.userId, user.name, user.password];

        client.query(query, values, (error) => {
          if (error) {
            throw error;
          } else {
            res.json({
              status: 'success',
              message: 'User account successfully created',
              info: user
            });
          }
        });
      });
    }
  );
};

const signinPost = (async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [req.body.name]);

    if (result.rows <= '0') {
      return res.status(401).json({
        message: 'no user record found'
      });
    }

    bcrypt.compare(req.body.password, result.rows[0].password).then(
      (valid) => {
        if (result.rows > '0' && valid) {
          const token = jwt.sign({ userId: result.rows.userId }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
          return res.json({
            message: 'user record found',
            token,
            data: result.rows[0]
          });
        }
        return res.status(401).json({
          message: 'record not found'
        });
      }
    );
  } catch (err) {
    return console.error(err);
  }
  return true;
});

module.exports = { signupPost, signinPost };
