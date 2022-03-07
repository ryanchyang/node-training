const jwt = require('jsonwebtoken')

const token = jwt.sign({name: '鄧傻序'},'TENG,HSU-SHOU');

console.log(token);

console.log(jwt.verify(token,'TENG,HSU-SHOU'));