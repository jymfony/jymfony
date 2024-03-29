import { EOL } from 'os';

const AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;
const Count = Jymfony.Component.Testing.Constraints.Count;
const GreaterThan = Jymfony.Component.Testing.Constraints.GreaterThan;
const HasKey = Jymfony.Component.Testing.Constraints.HasKey;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;
const IsEmpty = Jymfony.Component.Testing.Constraints.IsEmpty;
const IsEqual = Jymfony.Component.Testing.Constraints.IsEqual;
const IsFalse = Jymfony.Component.Testing.Constraints.IsFalse;
const IsIdentical = Jymfony.Component.Testing.Constraints.IsIdentical;
const IsInstanceOf = Jymfony.Component.Testing.Constraints.IsInstanceOf;
const IsNull = Jymfony.Component.Testing.Constraints.IsNull;
const IsTrue = Jymfony.Component.Testing.Constraints.IsTrue;
const IsType = Jymfony.Component.Testing.Constraints.IsType;
const IsUndefined = Jymfony.Component.Testing.Constraints.IsUndefined;
const LessThan = Jymfony.Component.Testing.Constraints.LessThan;
const LogicalNot = Jymfony.Component.Testing.Constraints.LogicalNot;
const LogicalOr = Jymfony.Component.Testing.Constraints.LogicalOr;
const RegularExpression = Jymfony.Component.Testing.Constraints.RegularExpression;
const StringContains = Jymfony.Component.Testing.Constraints.StringContains;
const StringFormat = Jymfony.Component.Testing.Constraints.StringFormat;
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
     * Asserts that an object has a specified key.
     *
     * @param {*} key
     * @param {*} object
     * @param {string} [message = '']
     *
     * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
     * @throws {Jymfony.Component.Testing.Exception.ExpectationFailedException}
     */
    static assertHasKey(key, object, message = '') {
        this.assertThat(object, new HasKey(key), message);
    }

    /**
     * Asserts the number of elements of an object.
     *
     * @param {int} expectedCount
     * @param {Iterator | *[] | Generator | Map | Set | Object} haystack
     * @param {string} message
     *
     * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertCount(expectedCount, haystack, message = '') {
        if (isArray(haystack) || isObjectLiteral(haystack) ||
            haystack instanceof Map || haystack instanceof Set ||
            undefined !== haystack[Symbol.iterator] || isFunction(haystack.next)) {
            this.assertThat(haystack, new Count(expectedCount), message);
        } else {
            throw new InvalidArgumentException(__jymfony.sprintf('Argument #2 of assertCount must be countable or iterable, %s given.', __jymfony.get_debug_type(haystack)));
        }
    }

    /**
     * Asserts the number of elements of an object is not equals to expected.
     *
     * @param {int} expectedCount
     * @param {Iterator | *[] | Generator | Map | Set | Object} haystack
     * @param {string} message
     *
     * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotCount(expectedCount, haystack, message = '') {
        if (isArray(haystack) || isObjectLiteral(haystack) ||
            haystack instanceof Map || haystack instanceof Set ||
            undefined !== haystack[Symbol.iterator] || isFunction(haystack.next)) {
            this.assertThat(haystack, this.logicalNot(new Count(expectedCount)), message);
        } else {
            throw new InvalidArgumentException(__jymfony.sprintf('Argument #2 of assertCount must be countable or iterable, %s given.', __jymfony.get_debug_type(haystack)));
        }
    }

    /**
     * Asserts that two variables are equal.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertEquals(expected, actual, message = '') {
        this.assertThat(actual, new IsEqual(expected), message);
    }

    /**
     * Asserts that two variables are not equal.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotEquals(expected, actual, message = '') {
        this.assertThat(actual, this.logicalNot(new IsEqual(expected)), message);
    }

    /**
     * Asserts that a variable is empty.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertEmpty(actual, message = '') {
        this.assertThat(actual, this.isEmpty(), message);
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
     * Asserts that two variables have not the same type and value.
     * Used on objects, it asserts that two variables reference
     * different objects.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotSame(expected, actual, message = '') {
        this.assertThat(actual, this.logicalNot(new IsIdentical(expected)), message);
    }

    /**
     * Asserts that a condition is true.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertTrue(condition, message = '') {
        this.assertThat(condition, this.isTrue(), message);
    }

    /**
     * Asserts that a condition is not true.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotTrue(condition, message = '') {
        this.assertThat(condition, this.logicalNot(this.isTrue()), message);
    }

    /**
     * Asserts that a condition is false.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertFalse(condition, message = '') {
        this.assertThat(condition, this.isFalse(), message);
    }

    /**
     * Asserts that a condition is not false.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotFalse(condition, message = '') {
        this.assertThat(condition, this.logicalNot(this.isFalse()), message);
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
     * Asserts that a variable is not null.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotNull(actual, message = '') {
        this.assertThat(actual, this.logicalNot(this.isNull()), message);
    }

    /**
     * Asserts that a string matches a given regex.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertMatchesRegularExpression(regex, string, message = '') {
        this.assertThat(string, new RegularExpression(regex), message);
    }

    /**
     * Asserts that a string matches a given format.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertStringMatchesFormat(format, string, message = '') {
        this.assertThat(string, new StringFormat(format), message);
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
     * Asserts that a variable is not undefined.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertNotUndefined(actual, message = '') {
        this.assertThat(actual, this.logicalNot(this.isUndefined()), message);
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
     * Asserts that a value is greater than or equal to another value.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertGreaterThanOrEqual(expected, actual, message = '') {
        this.assertThat(actual, this.greaterThanOrEqual(expected), message);
    }

    /**
     * Asserts that a value is less than another value.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertLessThan(expected, actual, message = '') {
        this.assertThat(actual, this.lessThan(expected), message);
    }

    /**
     * Asserts that a value is less than or equal to another value.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertLessThanOrEqual(expected, actual, message = '') {
        this.assertThat(actual, this.lessThanOrEqual(expected), message);
    }

    /**
     * Asserts that a string (needle) is contained in another string (haystack).
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertStringContainsString(needle, haystack, message = '') {
        this.assertThat(haystack, new StringContains(needle, false), message);
    }

    /**
     * Asserts that a string (needle) is NOT contained in another string (haystack).
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    static assertStringNotContainsString(needle, haystack, message = '') {
        this.assertThat(haystack, this.logicalNot(new StringContains(needle, false)), message);
    }

    /**
     * Asserts that a variable is of a given type.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertInstanceOf(expected, actual, message = '') {
        if (! ReflectionClass.exists(expected)) {
            throw new InvalidArgumentException('Invalid class or interface name passed');
        }

        __self.assertThat(actual, new IsInstanceOf(expected), message);
    }

    /**
     * Asserts that a variable is not of a given type.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertNotInstanceOf(expected, actual, message = '') {
        if (! ReflectionClass.exists(expected)) {
            throw new InvalidArgumentException('Invalid class or interface name passed');
        }

        __self.assertThat(actual, new LogicalNot(new IsInstanceOf(expected)), message);
    }

    /**
     * Asserts that a variable is undefined.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsUndefined(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_UNDEFINED), message);
    }

    /**
     * Asserts that a variable is a boolean.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsBoolean(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_BOOLEAN), message);
    }

    /**
     * Asserts that a variable is a number.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsNumber(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_NUMBER), message);
    }

    /**
     * Asserts that a variable is a BigInt.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsBigInt(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_BIGINT), message);
    }

    /**
     * Asserts that a variable is a string.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsString(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_STRING), message);
    }

    /**
     * Asserts that a variable is a symbol.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsSymbol(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_SYMBOL), message);
    }

    /**
     * Asserts that a variable is a function.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsFunction(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_FUNCTION), message);
    }

    /**
     * Asserts that a variable is an object.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsObject(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_OBJECT), message);
    }

    /**
     * Asserts that a variable is numeric.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsNumeric(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_NUMERIC), message);
    }

    /**
     * Asserts that a variable is an array.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsArray(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_ARRAY), message);
    }

    /**
     * Asserts that a variable is null.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsNull(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_NULL), message);
    }

    /**
     * Asserts that a variable is scalar.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsScalar(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_SCALAR), message);
    }

    /**
     * Asserts that a variable is a promise.
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     * @throws {InvalidArgumentException}
     */
    static assertIsPromise(actual, message = '') {
        __self.assertThat(actual, new IsType(IsType.TYPE_PROMISE), message);
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

    static logicalOr(...constraints) {
        return LogicalOr.fromConstraints(...constraints);
    }

    static logicalNot(constraint) {
        return new LogicalNot(constraint);
    }

    static lessThan(value) {
        return new LessThan(value);
    }

    static lessThanOrEqual(value) {
        return this.logicalOr(
            new IsEqual(value),
            new LessThan(value)
        );
    }

    static greaterThan(value) {
        return new GreaterThan(value);
    }

    static greaterThanOrEqual(value) {
        return this.logicalOr(
            new IsEqual(value),
            new GreaterThan(value)
        );
    }

    static isEmpty() {
        return new IsEmpty();
    }

    static isTrue() {
        return new IsTrue();
    }

    static isFalse() {
        return new IsFalse();
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


for (const m of Object.getOwnPropertyNames(Assert)) {
    const method = Assert[m];
    if (!isFunction(method)) {
        continue;
    }

    Assert.prototype[m] = method;
}
