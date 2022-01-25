const http = require('http');
const fs = require('fs').promises;

server = http.createServer(async (req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html ;charset=utf-8',
  });
  try {
    const fsload = await fs.readFile(`${__dirname}/headers.txt`);

    console.log(fsload);
    res.end(fsload);
  } catch (err) {
    res.end('err');
  }
});

server.listen(3000);
