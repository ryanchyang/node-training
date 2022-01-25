const http = require('http');
const fs = require('fs');

server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html ;charset=utf-8',
  });
  fs.writeFile(
    `${__dirname}/headers.txt`,
    JSON.stringify(req.headers, null, 4),
    (err) => {
      if (err) {
        console.log(err);
        res.end('有問題');
      } else {
        res.end('沒問題');
      }
    }
  );
});

server.listen(3000);
