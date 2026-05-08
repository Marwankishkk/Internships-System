const bcrypt = require('bcrypt');

const verifyPassword = (inputPassword, storedPassword) => {
    const hashedPassword = bcrypt.hash(inputPassword, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return false;
        }
        return hash === storedPassword;
    });

  return hashedPassword === storedPassword;
}

module.exports = { verifyPassword };