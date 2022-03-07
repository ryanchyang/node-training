const jwt = require('jsonwebtoken');
const key = 'jdfkdf7593845UUIGOIP09345';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOjEsImFjY291bnQiOiJzaGluZGVyIiwiaWF0IjoxNjQ2NjM5NDgyfQ.SePq6W_Gu5iH1sjAbRWYSGk_NGZeEfRz1B4mx5v4gPIa';

let oriData;
try{
    oriData = jwt.verify(token, key);
} catch(ex){
    console.log({ex});
}

console.log(oriData);
