const http = require('http');
const fs = require('fs');

server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html ;charset=utf-8',
  });
  fs.writeFileSync(
    `${__dirname}/headers2.txt`,
    JSON.stringify(req.headers, null, 4),
    (err) => {
      if (err) {
        console.log(err);
        res.end('err');
      } else {
        res.end('success');
      }
    }
  );

  fs.readFile(`${__dirname}/headers2.txt`, (err, data) => {
    if (err) {
      console.log(err);
      res.end('err');
    } else {
      res.writeHead(200, {
        'Content-type': 'application/json ;charset=utf-8',
      });
      res.end(data);
    }
  });
});

server.listen(3000);
