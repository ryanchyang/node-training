const express = require('express');
const db = require('./../modules/connect-db');

const router = express.Router();

async function getListData(req, res) {
  const perPage = 5;
  let page = req.query.page ? parseInt(req.query.page) : 1;

  if (page < 1) {
    res.redirect('/address-book/list');
  }

  const conditions = {};
  let search = req.query.search ? req.query.search : '';
  search = search.trim();
  let sqlWhere = 'WHERE 1';
  if (search) {
    sqlWhere += ` AND \`name\` LIKE ${db.escape('%' + search + '%')}`;
    conditions.search = search;
  }

  const output = {
    // success: false,
    perPage,
    page,
    totalRows: 0,
    totalPages: 0,
    rows: [],
    conditions,
  };

  const t_sql = `SELECT COUNT(1) num FROM address_book ${sqlWhere}`;
  const [rs1] = await db.query(t_sql);
  const totalRows = rs1[0].num;
  let totalPages = 0;
  if (totalRows) {
    output.totalPages = Math.ceil(totalRows / perPage);
    output.totalRows = totalRows;

    if (page > output.totalPages) {
      res.redirect('/address-book/list');
    }
    const sql = `SELECT * FROM address_book ${sqlWhere} ORDER BY sid DESC LIMIT ${
      perPage * (page - 1)
    } ,${perPage}`;

    const [rs2] = await db.query(sql);
    rs2.forEach((el) => {
      el.birthday = res.locals.toDateString(el.birthday);
    });
    output.rows = rs2;
  }
  return output;
  // res.render('address-book/list', output);
}

router.get('/', async (req, res) => {
  res.redirect('/address-book/list');
});
router.get('/add', async (req, res) => {
  res.render('address-book/add', await getListData(req, res));
});
router.get('/list', async (req, res) => {
  res.render('address-book/list', await getListData(req, res));
});

router.get('/api/list', async (req, res) => {
  res.json(await getListData(req, res));
});

module.exports = router;
