const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

console.log(process.env.USER_NAME);
console.log(process.env.USER_PASS);
