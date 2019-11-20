CREATE TABLE employees
(
  employeeid SERIAL PRIMARY KEY,
  firstname CHARACTER varying(50),
  lastname CHARACTER varying(50),
  email CHARACTER varying(50),
  employee_pwd CHARACTER varying(50),
  gender CHARACTER varying(10),
  job_role CHARACTER varying(50),
  department CHARACTER varying (80),
  employee_address CHARACTER varying (100)
);

CREATE TABLE posts
(
  postid SERIAL PRIMARY KEY,
  post_type INT,
  poster INT REFERENCES employees(employeeid),
  /* 1 for text and 2 for images*/
  title CHARACTER varying(50),
  article varchar,
  imgURL CHARACTER varying(100),
  createdon timestamp
);

CREATE TABLE admins
(
  adminid SERIAL PRIMARY KEY,
  email CHARACTER varying (50),
  admin_pwd CHARACTER varying (50)
);

CREATE TABLE comments
(
  commentid SERIAL PRIMARY KEY,
  postid INT REFERENCES posts(postid),
  comment CHARACTER varying (50),
  commenter INT REFERENCES employees(employeeid),
  createdon timestamp
);