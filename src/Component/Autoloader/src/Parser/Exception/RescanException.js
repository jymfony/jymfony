class RescanException extends Error {
    constructor(token) {
        super();

        this.token = token;
    }
}

module.exports = RescanException;
