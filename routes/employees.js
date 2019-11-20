const { Router } = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const adminAuth = require('../middleware/admin-auth');

const router = Router();

router.get('/', (request, response) => {
  pool.query('SELECT * FROM employees', (err, res) => {
    if (err) console.log(err);

    // console.log(res.rows);
    response.status(200).json(res.rows);
  });
});

// Route to create new User
router.post('/createUser', adminAuth, (request, response) => {
  const {
    firstname,
    lastname,
    email,
    password,
    gender,
    jobRole,
    department,
    employeeAddress
  } = request.body;

  pool.query(
    `INSERT INTO employees (firstname, lastname, email, employee_pwd, gender, job_role, department, employee_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      firstname,
      lastname,
      email,
      password,
      gender,
      jobRole,
      department,
      employeeAddress
    ],
    (err, res) => {
      if (err) console.log(err);
      response.status(200).json('User created successfully');
    }
  );
});

// Route to authenticate user
router.get('/auth', (request, response) => {
  const { email, password } = request.body;

  const employeeObj = {};
  pool.query(
    'SELECT * FROM employees where email = $1 and employee_pwd = $2',
    [email, password],
    (err, res) => {
      if (err) console.log(err);
      const count = res.rowCount;

      if (count >= 1) {
        const empid = res.rows[0].employeeid;
        const token = jwt.sign(
          {
            email,
            empid
          },
          'secret',
          { expiresIn: '8h' }
        );
        employeeObj.message = 'Auth Successful';
        employeeObj.token = token;
      } else {
        employeeObj.message = 'This user does not exist';
      }

      response.json({ employeeObj });
    }
  );
});

module.exports = router;
