console.log(process.env.NODE_ENV);

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const multer = require('multer');
const cors = require('cors');
const app = express();
// const upload = multer({ dest: 'tmp_uploads/' }); // 暫存路徑
const upload = require('./modules/upload-imgs');
const fs = require('fs').promises;
const db = require('./modules/connect-db');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios');
const sessionStore = new MysqlStore({}, db);


app.set('view engine', 'ejs');
// app.get('/a.html', function (req, res) {
//   res.send('動態內容');
// });

// Top-level middleware
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // console.log('origin:' + origin);
    callback(null, true);
  },
};
app.use(cors(corsOptions));
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(express.static('node_modules/joi')); // 把設成靜態檔案位置 再用前端script引入

app.use(
  session({
    // 新用戶沒有使用到 session 物件時不會建立 session 和發送 cookie
    saveUninitialized: false, // 沒設定session變數就不會存取
    resave: false, // 沒變更內容是否強制回存
    secret: 'asdasff1458144gggmjkkl13344564xvvfg',
    store: sessionStore,
    cookie: {
      maxAge: 1200000, // 20分鐘，單位毫秒
    },
  })
);

// 自訂的middleware
app.use((req, res, next) => {
  res.locals.ryan = '哈囉';

  // template helper functions
  res.locals.toDateString = (d) => moment(d).format('YYYY-MM-DD');
  res.locals.toDateTimeString = (d) => moment(d).format('YYYY-MM-DD HH:mm:ss');

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
const { func } = require('joi');
const { env } = require('process');
app.use('/admin2', admin2Router);

app.use('/address-book', require('./routes/adress-book'));

app.get('/try-session', (req, res) => {
  req.session.my_var = req.session.my_var || 0;
  req.session.my_var++;
  res.json(req.session);
});

app.get('/try-moment', (req, res) => {
  const fm = 'YYYY-MM-DD HH:mm:ss';

  res.json({
    mo1: moment().format(fm),
    mo2: moment().tz('Europe/London').format(fm),
    mo3: moment(req.session.cookie.expires).format(fm),
    mo4: moment(req.session.cookie.expires).tz('Europe/London').format(fm),
  });
});

app.get('/try-db', async (req, res) => {
  const sql = `SELECT * FROM address_book LIMIT 5`;

  const [results, fields] = await db.query(sql);
  res.json(results);
});

app.get('/yahoo', async function (req, res) {
  // 後端的fetch功能
  fetch('https://tw.yahoo.com/?p=us')
    .then((r) => r.text())
    .then((txt) => res.send(txt));
});

app.get('/yahoo2', async function (req, res) {
  // 後端的fetch功能
  const response = await axios('https://tw.yahoo.com/?p=us');

  res.send(response.data);
});

// 登入的表單
app.get('/login', async (req, res)=>{
  res.render('login');
});
// 檢查登入帳密
app.post('/login', async (req, res)=>{
  const output = {
    success: false,
    error: '',
    info: null,
    token: '',
    code: 0,
};

const [rs] = await db.query('SELECT * FROM admins WHERE account=?', [req.body.account]);

if(! rs.length){
    output.error = '帳密錯誤';
    output.code = 401;
    return res.json(output);
}
const row = rs[0];

const compareResult = await bcrypt.compare(req.body.password, row.password);
if(! compareResult){
    output.error = '帳密錯誤';
    output.code = 402;
    return res.json(output);
}

const {account, avatar, nickname} = row;
output.success = true;
output.info = {account, avatar, nickname};

output.token = jwt.sign( {account, avatar}, process.env.JWT_KEY)

res.json(output);
});


app.use(function (req, res) {
  res.status(404).send('走錯路了');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('server started', `${port}`, new Date());
});
