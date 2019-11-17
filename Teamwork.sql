CREATE TABLE employees(
  employeeid serial,
  firstname character varying(50),
  lastname character varying(50),
  email character varying(50),
  employee_pwd character varying(50),
  gender character varying(10),
  job_role character varying(50),
  department character varying (80),
  employee_address character varying (100) 
);

CREATE TABLE posts (
  postid serial,
  post_type int, /* 1 for text and 2 for images*/
  title character varying(50),
  article character varying(400),
  imgURL character varying(100),
  createdon timestamp  
);

CREATE TABLE admins (
  adminid serial,
  email character varying (50),
  admin_pwd character varying (50)
);

CREATE TABLE comments (
  commentid serial,
  postid int,
  comment character varying (50),
  createdon timestamp
);