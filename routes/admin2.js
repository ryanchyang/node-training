const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');
const router = express.Router();

router.all('*', (req, res, next) => {
  res.locals.ryan += '你好';
  next();
});

router.get('/myform/:sid', async (req, res)=>{
  const sid = parseInt(req.params.sid) || 0;
  const [rs] = await db.query(`SELECT account,avatar,nickname FROM admins WHERE sid=${sid}`);

  res.json(rs);
});
router.put('/myform/:sid', upload.single('avatar'),async (req,res)=>{
  // return res.json(req.body);
  let modifyAvatar = '';
  if(req.file && req.file.filename){
      modifyAvatar = ` , avatar='${req.file.filename}' `;
  };

  const sql = `UPDATE admins SET nickname=? ${modifyAvatar} WHERE sid=? `;

  const result = await db.query(sql, [req.body.nickname, req.params.sid ]);

  res.json(result);

});

router.get('/:p1?/:p2?', function (req, res) {
  let { params, url, originalUrl, baseUrl } = req;

  res.json({ params, url, originalUrl, baseUrl, data: res.locals.ryan });
});

module.exports = router;
