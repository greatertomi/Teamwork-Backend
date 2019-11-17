const { Router } = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const pool = require('../db');
const checkAuth = require('../middleware/check-auth');

const router = Router();
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

cloudinary.config({
  cloud_name: 'profj001',
  api_key: '423589193815927',
  api_secret: 'KO1VNau0GmqX-9YI6qHuBwu6870'
});

const upload = multer({ storage });

router.get('/', checkAuth, (request, response) => {
  pool.query('SELECT * FROM posts ORDER BY createdon DESC', (err, res) => {
    if (err) console.log(err);

    response.json(res.rows);
  });
});

router.get('/view/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  pool.query('SELECT * FROM posts WHERE postid = $1', [id], (err, res) => {
    if (err) console.log(err);

    response.json(res.rows);
  });
});

router.post('/create', checkAuth, (request, response) => {
  const { title, article } = request.body;

  pool.query(
    `INSERT INTO posts (post_type, title, article, createdon)
  VALUES (1, $1, $2, now())`,
    [title, article],
    (err, res) => {
      if (err) console.log(err);

      response.redirect('/api/v1/articles');
    }
  );
});

router.put('/edit/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  // const { title } = request.body;
  const keys = ['title', 'article'];
  const fields = [];

  keys.forEach(key => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE posts SET ${field} = ($1) where postid=($2)`,
      [request.body[field], id],
      (err, res) => {
        if (err) console.log(err);

        if (index === fields.length - 1) response.redirect('/api/v1/articles');
      }
    );
  });
});

router.delete('/delete/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  pool.query('DELETE FROM posts where postid = ($1)', [id], (err, res) => {
    if (err) console.log(err);

    response.redirect('/api/v1/articles');
  });
});

router.post('/comment/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const { comment } = request.body;

  pool.query(
    `INSERT INTO comments (postid, comment, createdon) VALUES ($1, $2, now())`,
    [id, comment],
    (res, err) => {
      if (err) console.log(err);

      response.json('Comment Saved');
    }
  );
});

router.post('/upload', checkAuth, upload.single('gif'), (request, response) => {
  const { path } = request.file;
  const { title } = request.body;

  let imgurl;
  cloudinary.uploader.upload(`${path}`, { tags: 'basic_sample' }, function(
    error,
    image
  ) {
    if (error) {
      console.warn(error);
    }
    imgurl = image.url;
    pool.query(
      `INSERT INTO posts (post_type, title, imgurl, createdon)
    VALUES (2, $1, $2, now())`,
      [title, imgurl],
      (err, res) => {
        if (err) console.log(err);

        response.redirect('/api/v1/articles');
      }
    );
    // res.json({ imageUrl });
    // console.log(image.url);
  });
});

router.delete('/deletegif/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  pool.query('DELETE FROM posts where postid = ($1)', [id], (err, res) => {
    if (err) console.log(err);

    response.redirect('/api/v1/articles');
  });
});

module.exports = router;
