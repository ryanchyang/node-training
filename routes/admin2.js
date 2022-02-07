const express = require('express');

const router = express.Router();

router.all('*', (req, res, next) => {
  res.locals.ryan += '你好';
  next();
});

router.get('/:p1?/:p2?', function (req, res) {
  let { params, url, originalUrl, baseUrl } = req;

  res.json({ params, url, originalUrl, baseUrl, data: res.locals.ryan });
});

module.exports = router;
