class ErrorCasterFixtures {
    static getAnonymousError() { return new class extends Error{} (); } // eslint-disable-line brace-style
}

module.exports = ErrorCasterFixtures;
