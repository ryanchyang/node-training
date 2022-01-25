const http = require('http');

server = http.createServer((req, res) => {
  console.log(req.url);
  res.writeHead(200, {
    'Content-type': 'text/html',
  });

  res.write('<p>456</p>');
  res.end(`<h2>hola 123</h2>
  <p>${req.url}</p>`);
});

server.listen(3000);
