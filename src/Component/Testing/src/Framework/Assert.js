import { EOL } from 'os';

const AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;
const GreaterThan = Jymfony.Component.Testing.Constraints.GreaterThan;
const IsEmpty = Jymfony.Component.Testing.Constraints.IsEmpty;
const IsEqual = Jymfony.Component.Testing.Constraints.IsEqual;
const IsIdentical = Jymfony.Component.Testing.Constraints.IsIdentical;
const IsNull = Jymfony.Component.Testing.Constraints.IsNull;
const IsUndefined = Jymfony.Component.Testing.Constraints.IsUndefined;
const LogicalNot = Jymfony.Component.Testing.Constraints.LogicalNot;
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
     * Asserts that two variables are equal.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertEquals(expected, actual, message = '') {
        this.assertThat(actual, new IsEqual(expected), message);
    }

    /**
     * Asserts that a variable is not empty.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotEmpty(actual, message = '') {
        this.assertThat(actual, this.logicalNot(this.isEmpty()), message);
    }

    /**
     * Asserts that two variables have the same type and value.
     * Used on objects, it asserts that two variables reference
     * the same object.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertSame(expected, actual, message = '') {
        this.assertThat(actual, new IsIdentical(expected), message);
    }

    /**
     * Asserts that a variable is null.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNull(actual, message = '') {
        this.assertThat(actual, this.isNull(), message);
    }

    /**
     * Asserts that a variable is undefined.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertUndefined(actual, message = '') {
        this.assertThat(actual, this.isUndefined(), message);
    }

    /**
     * Asserts that a value is greater than another value.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertGreaterThan(expected, actual, message = '') {
        this.assertThat(actual, this.greaterThan(expected), message);
    }

    /**
     * Evaluates a Constraint matcher object.
     *
     * @param {*} value
     * @param {Jymfony.Component.Testing.Constraints.Constraint} constraint
     * @param {string} [message = '']
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertThat(value, constraint, message = '') {
        count += constraint.length;
        constraint.evaluate(value, message);
    }

    static logicalNot(constraint) {
        return new LogicalNot(constraint);
    }

    static greaterThan(value) {
        return new GreaterThan(value);
    }

    static isEmpty() {
        return new IsEmpty();
    }

    static isNull() {
        return new IsNull();
    }

    static isUndefined() {
        return new IsUndefined();
    }

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
     * @internal
     */
    static addToAssertionCount(num) {
        count += num;
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
