console.log(process.env.NODE_ENV);

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'tmp_uploads/' });
const fs = require('fs').promises;

app.set('view engine', 'ejs');
// app.get('/a.html', function (req, res) {
//   res.send('動態內容');
// });

// Top-level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('home', { name: 'Ryan' });
});

app.get('/a/b', function (req, res) {
  res.render('home', { name: 'Ryan' });
});

app.get('/tour-simple', function (req, res) {
  const data = require('./data/tours-simple');
  console.log(data[0].name);
  res.send(data[0].name);
});

app.get('/json-tours', (req, res) => {
  const tours = require('./data/tours-simple'); // 進來變成陣列
  // TODO: 排序
  console.log(tours);
  res.render('json-tours', { tours });
});

app.get('/try-qs', function (req, res) {
  res.json(req.query);
});

// const urlencodedParser = express.urlencoded({ extended: false }); //是一個middleware

app.post('/try-post', function (req, res) {
  console.log(typeof req.body);
  res.json(req.body);
});

app.get('/try-post-form', (req, res) => {
  res.render('try-post-form');
});

app.post('/try-post-form', (req, res) => {
  res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), async function (req, res) {
  const types = ['image/jpeg', 'image/png'];
  const file = req.file;
  if (file && file.originalname) {
    if (types.includes(file.mimetype)) {
      await fs.rename(
        file.path,
        `${__dirname}/public/img/${file.originalname}` //磁碟的路徑
      );
      return res.redirect(`/img/${file.originalname}`); //網站的路徑
    }
  }

  res.send('傳輸失敗');
});

app.use(function (req, res) {
  res.status(404).send('走錯路了');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('server started', `${port}`, new Date());
});
