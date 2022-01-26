console.log(process.env.NODE_ENV);

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
// app.get('/a.html', function (req, res) {
//   res.send('動態內容');
// });

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('home', { name: 'Ryan' });
});

app.use(function (req, res) {
  res.status(404).send('走錯路了');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('server started', `${port}`, new Date());
});
