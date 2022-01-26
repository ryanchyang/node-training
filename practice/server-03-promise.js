const http = require('http');
const fs = require('fs');

function myReadFIle(file_path) {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, (err, data) => {
      if (err) {
        reject('error');
      } else {
        resolve(data);
      }
    });
  });
}

server = http.createServer(async (req, res) => {
  const data = await myReadFIle(`${__dirname}/headers.txt`);

  res.writeHead(200, {
    'Content-type': 'application/json ;charset=utf-8',
  });
  res.end(data);
});

server.listen(3000);
