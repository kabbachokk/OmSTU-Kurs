const bcrypt = require('bcryptjs');
passwordHash = bcrypt.hashSync('1234', 12);
console.log(passwordHash)