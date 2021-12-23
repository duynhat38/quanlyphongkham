const bcrypt = require('bcrypt');

module.exports = async function(password) {
    const saltRounds = 8;
    var salt = await bcrypt.genSaltSync(saltRounds);
    var hashedPassword = await bcrypt.hashSync(password, salt);
    return hashedPassword;
}