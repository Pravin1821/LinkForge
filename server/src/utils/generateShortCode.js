const {nanoid} = require("nanoid");
const generateShortCode = () => {
    return nanoid(8);
};
module.exports = generateShortCode;
