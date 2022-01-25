const obj = require(`${__dirname}/person`);
const { Person } = require(`${__dirname}/person`);

const p2 = new obj.Person('Miles', 31);
const p3 = new Person('Joe', 32);

console.log(p2);
console.log(p3);
console.log(obj.Person === Person);
