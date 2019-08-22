class NotARegExpException extends Error {
    constructor(token) {
        super();

        this.token = token;
    }
}

module.exports = NotARegExpException;
