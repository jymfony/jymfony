import { EOL } from 'os';

const AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;
const SkippedTestException = Jymfony.Component.Testing.Framework.Exception.SkippedTestException;
const SyntheticSkippedException = Jymfony.Component.Testing.Framework.Exception.SyntheticSkippedException;

let count = 0;

/**
 * @param {string} message
 * @return {*}
 */
const detectLocationHint = (message) => {
    const hint = {};
    const lines = message.split(/\r\n|\r|\n/);

    while (lines[0].includes('__OFFSET')) {
        const offset = lines.shift().split('=');

        if ('__OFFSET_FILE' === offset[0]) {
            hint.file = offset[1];
        }

        if ('__OFFSET_LINE' === offset[0]) {
            hint.line = offset[1];
        }
    }

    if (hint) {
        hint.message = lines.join(EOL);
    }

    return hint;
};

/**
 * @memberOf Jymfony.Component.Testing.Framework
 */
export default class Assert {
    /**
     * Fails a test with the given message.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.AssertionFailedException}
     */
    static fail(message = '') {
        count++;

        throw new AssertionFailedException(message);
    }

    /**
     * Marks current test as skipped and stops execution.
     */
    static markTestSkipped(message = '') {
        const hint = detectLocationHint(message);
        if (hint) {
            const trace = (new Exception()).stackTrace;
            trace.unshift(trace, hint);

            throw new SyntheticSkippedException(hint.message, 0, hint.file, ~~hint.line, trace);
        }

        throw new SkippedTestException(message);
    }

    /**
     * Return the current assertion count.
     */
    static getCount() {
        return count;
    }

    /**
     * Reset the assertion counter.
     */
    static resetCount() {
        count = 0;
    }
}

const reflectionClass = new ReflectionClass(Assert);

/**
 * @type {ReflectionMethod[]}
 */
const assertMethods = reflectionClass.methods
    .map(reflectionClass.getMethod.bind(reflectionClass))
    .filter(method => method.reflectionClass.getConstructor() === reflectionClass.getConstructor() && method.isStatic);

for (const method of assertMethods) {
    Assert.prototype[method.name] = Assert[method.name];
}
