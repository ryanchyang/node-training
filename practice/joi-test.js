const Joi = require('joi');

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  age: Joi.number().required(),
});

console.log(schema.validate({ username: 'milestang', age: 23 }));
