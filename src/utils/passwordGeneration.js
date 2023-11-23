const bcrypt = require('bcrypt');
const saltRound = 12;

const generateHash = (plainPassword)=>{
    return bcrypt.hashSync(plainPassword, saltRound)
}

const comparePassword = (plainPassword, hash)=>{
    return bcrypt.compareSync(plainPassword, hash);
}

module.exports = {generateHash, comparePassword};