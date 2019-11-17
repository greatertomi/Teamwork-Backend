const { Router } = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = Router();

router.get('/signin', (request, response) => {
  const { email, password } = request.body;

  const adminObj = {};
  pool.query(
    'SELECT * FROM admins where email = $1 and admin_pwd = $2',
    [email, password],
    (err, res) => {
      if (err) console.log(err);
      const count = res.rowCount;

      if (count >= 1) {
        const { adminid } = res.rows[0];
        const token = jwt.sign(
          {
            email,
            adminid
          },
          'Iamadmin',
          { expiresIn: '8h' }
        );
        adminObj.message = 'Auth Successful';
        adminObj.token = token;
      } else {
        adminObj.message = 'This user does not exist';
      }

      response.json({ adminObj });
    }
  );
});

module.exports = router;
