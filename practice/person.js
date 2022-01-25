class Person {
  constructor(name = 'noname', age = '0') {
    this.name = name;
    this.age = age;
  }
  toJSON() {
    return {
      name: this.name,
      age: this.age,
    };
  }
  sayHello() {
    return `Hello ${this.name}`;
  }
}

const f3 = (a) => a * a * a;

// const bill = new Person('Bill', '23');
// console.log(bill.sayHello());
// console.log(JSON.stringify(bill.toJSON()));
// console.log(JSON.stringify(bill));

module.exports = { Person, f3 };
