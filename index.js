console.log(process.env.NODE_ENV);

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const multer = require('multer');
const app = express();
// const upload = multer({ dest: 'tmp_uploads/' }); // 暫存路徑
const upload = require('./modules/upload-imgs');
const fs = require('fs').promises;

app.set('view engine', 'ejs');
// app.get('/a.html', function (req, res) {
//   res.send('動態內容');
// });

// Top-level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// 自訂的middleware
app.use((req, res, next) => {
  res.locals.ryan = '哈囉';
  next();
});

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
  res.json(req.file);
  // const types = ['image/jpeg', 'image/png'];
  // const file = req.file;
  // if (file && file.originalname) {
  //   if (types.includes(file.mimetype)) {
  //     await fs.rename(
  //       file.path,
  //       `${__dirname}/public/img/${file.originalname}` //磁碟的路徑
  //     );
  //     return res.redirect(`/img/${file.originalname}`); //網站的路徑
  //   } else {
  //     return res.send('傳輸檔案失敗');
  //   }
  // }
  // res.send('bad');
});

app.post('/try-uploads', upload.array('photos'), async function (req, res) {
  // console.log(req.files);
  const fileArray = [...req.files];
  // const fileObj = {};
  // const sendArray = fileArray.map((obj) => {
  //   fileObj.mimetype = obj.mimetype;
  //   fileObj.originalname = obj.originalname;
  //   fileObj.size = obj.size;

  //   return fileObj;
  // });

  const result = fileArray.map(({ mimetype, filename, size }) => {
    return { mimetype, filename, size };
  });
  res.json(result);
});

app.get('/my-params1/:action/:id', function (req, res) {
  res.json(req.params);
});

app.get('/my-params1/:action?/:id?', function (req, res) {
  res.json(req.params);
});

app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/i, function (req, res) {
  let u = req.url;
  u = u.split('?')[0];
  u = u.slice(3);
  u = u.replaceAll('-', ''); // u.split('-').join('')
  res.json({ mobile: u });
});

const admin2Router = require('./routes/admin2');
app.use('/admin2', admin2Router);

app.use(function (req, res) {
  res.status(404).send('走錯路了');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('server started', `${port}`, new Date());
});
