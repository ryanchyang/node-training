// const f1 = require('./func01'); //method1
const f1 = require(`${__dirname}/func01`); //method2

console.log('f2', f1(4));
