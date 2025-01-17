globalThis.__assert = function (condition, msg) {
    if (! condition) {
        throw new Error(msg || 'Assertion failed');
    }
};
