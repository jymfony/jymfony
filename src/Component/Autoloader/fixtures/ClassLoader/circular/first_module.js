const second = require('./second_module');

module.exports = class First {
    getSecond() {
        return second;
    }
};
