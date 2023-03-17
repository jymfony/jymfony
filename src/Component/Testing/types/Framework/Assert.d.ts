declare namespace Jymfony.Component.Testing.Framework {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;
    import GreaterThan = Jymfony.Component.Testing.Constraints.GreaterThan;
    import IsEmpty = Jymfony.Component.Testing.Constraints.IsEmpty;
    import IsFalse = Jymfony.Component.Testing.Constraints.IsFalse;
    import IsNull = Jymfony.Component.Testing.Constraints.IsNull;
    import IsTrue = Jymfony.Component.Testing.Constraints.IsTrue;
    import IsUndefined = Jymfony.Component.Testing.Constraints.IsUndefined;
    import LessThan = Jymfony.Component.Testing.Constraints.LessThan;
    import LogicalNot = Jymfony.Component.Testing.Constraints.LogicalNot;
    import LogicalOr = Jymfony.Component.Testing.Constraints.LogicalOr;

    export class Assert {
        /**
         * Asserts that an object has a specified key.
         *
         * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
         * @throws {Jymfony.Component.Testing.Exception.ExpectationFailedException}
         */
        static assertHasKey(key: any, object: any, message?: string): void;
        assertHasKey(key: any, object: any, message?: string): void;

        /**
         * Asserts the number of elements of an object.
         *
         * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertCount(expected: any, actual: any, message?: string): void;
        assertCount(expected: any, actual: any, message?: string): void;

        /**
         * Asserts the number of elements of an object is not equals to expected.
         *
         * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertNotCount(expected: any, actual: any, message?: string): void;
        assertNotCount(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that two variables are equal.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertEquals(expected: any, actual: any, message?: string): void;
        assertEquals(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a variable is empty.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertEmpty(actual: any, message?: string): void;
        assertEmpty(actual: any, message?: string): void;

        /**
         * Asserts that a variable is not empty.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertNotEmpty(actual: any, message?: string): void;
        assertNotEmpty(actual: any, message?: string): void;

        /**
         * Asserts that two variables have the same type and value.
         * Used on objects, it asserts that two variables reference
         * the same object.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertSame(expected: any, actual: any, message?: string): void;
        assertSame(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a condition is true.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertTrue(expected: any, message?: string): void;
        assertTrue(expected: any, message?: string): void;

        /**
         * Asserts that a condition is not true.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertNotTrue(expected: any, message?: string): void;
        assertNotTrue(expected: any, message?: string): void;

        /**
         * Asserts that a condition is false.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertFalse(expected: any, message?: string): void;
        assertFalse(expected: any, message?: string): void;

        /**
         * Asserts that a condition is not false.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertNotFalse(expected: any, message?: string): void;
        assertNotFalse(expected: any, message?: string): void;

        /**
         * Asserts that a variable is null.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertNull(actual: any, message?: string): void;
        assertNull(actual: any, message?: string): void;

        /**
         * Asserts that a variable is not null.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertNotNull(actual: any, message?: string): void;
        assertNotNull(actual: any, message?: string): void;

        /**
         * Asserts that a string matches a given regex.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertMatchesRegularExpression(regex: RegExp, string: string, message?: string): void;
        assertMatchesRegularExpression(regex: RegExp, string: string, message?: string): void;

        /**
         * Asserts that a variable is undefined.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertUndefined(actual: any, message?: string): void;
        assertUndefined(actual: any, message?: string): void;

        /**
         * Asserts that a value is less than another value.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertLessThan(expected: any, actual: any, message?: string): void;
        assertLessThan(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a value is less than or equal to another value.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertLessThanOrEqual(expected: any, actual: any, message?: string): void;
        assertLessThanOrEqual(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a value is greater than another value.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertGreaterThan(expected: any, actual: any, message?: string): void;
        assertGreaterThan(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a value is greater than or equal to another value.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertGreaterThanOrEqual(expected: any, actual: any, message?: string): void;
        assertGreaterThanOrEqual(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a string (needle) is contained in another string (haystack).
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertStringContainsString(needle: string, haystack: string, message?: string): void;
        assertStringContainsString(needle: string, haystack: string, message?: string): void;

        /**
         * Asserts that a string (needle) is notcontained in another string (haystack).
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertStringNotContainsString(needle: string, haystack: string, message?: string): void;
        assertStringNotContainsString(needle: string, haystack: string, message?: string): void;

        /**
         * Asserts that a variable is of a given type.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertInstanceOf(expected: string | Newable, actual: any, message?: string): void;
        assertInstanceOf(expected: string | Newable, actual: any, message?: string): void;

        /**
         * Asserts that a variable is not of a given type.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertNotInstanceOf(expected: string | Newable, actual: any, message?: string): void;
        assertNotInstanceOf(expected: string | Newable, actual: any, message?: string): void;

        /**
         * Asserts that a variable is undefined.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsUndefined(actual: any, message?: string): void;
        assertIsUndefined(actual: any, message?: string): void;

        /**
         * Asserts that a variable is a boolean.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsBoolean(actual: any, message?: string): void;
        assertIsBoolean(actual: any, message?: string): void;

        /**
         * Asserts that a variable is a number.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsNumber(actual: any, message?: string): void;
        assertIsNumber(actual: any, message?: string): void;

        /**
         * Asserts that a variable is a BigInt.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsBigInt(actual: any, message?: string): void;
        assertIsBigInt(actual: any, message?: string): void;

        /**
         * Asserts that a variable is a string.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsString(actual: any, message?: string): void;
        assertIsString(actual: any, message?: string): void;

        /**
         * Asserts that a variable is a symbol.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsSymbol(actual: any, message?: string): void;
        assertIsSymbol(actual: any, message?: string): void;

        /**
         * Asserts that a variable is a function.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsFunction(actual: any, message?: string): void;
        assertIsFunction(actual: any, message?: string): void;

        /**
         * Asserts that a variable is an object.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsObject(actual: any, message?: string): void;
        assertIsObject(actual: any, message?: string): void;

        /**
         * Asserts that a variable is numeric.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsNumeric(actual: any, message?: string): void;
        assertIsNumeric(actual: any, message?: string): void;

        /**
         * Asserts that a variable is an array.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsArray(actual: any, message?: string): void;
        assertIsArray(actual: any, message?: string): void;

        /**
         * Asserts that a variable is null.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsNull(actual: any, message?: string): void;
        assertIsNull(actual: any, message?: string): void;

        /**
         * Asserts that a variable is scalar.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         * @throws {InvalidArgumentException}
         */
        static assertIsScalar(actual: any, message?: string): void;
        assertIsScalar(actual: any, message?: string): void;

        /**
         * Evaluates a Constraint matcher object.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertThat(value: any, constraint: Constraint, message?: string): void;
        assertThat(value: any, constraint: Constraint, message?: string): void;

        static logicalOr(...constraints: Constraint[]): LogicalOr;
        logicalOr(...constraints: Constraint[]): LogicalOr;

        static logicalNot(constraint: Constraint): LogicalNot;
        logicalNot(constraint: Constraint): LogicalNot;

        static greaterThan(value: any): GreaterThan;
        greaterThan(value: any): GreaterThan;

        static greaterThanOrEqual(value: any): LogicalOr;
        greaterThanOrEqual(value: any): LogicalOr;

        static lessThan(value: any): LessThan;
        lessThan(value: any): LessThan;

        static lessThanOrEqual(value: any): LogicalOr;
        lessThanOrEqual(value: any): LogicalOr;

        static isEmpty(): IsEmpty;
        isEmpty(): IsEmpty;

        static isTrue(): IsTrue;
        isTrue(): IsTrue;

        static isFalse(): IsFalse;
        isFalse(): IsFalse;

        static isNull(): IsNull;
        isNull(): IsNull;

        static isUndefined(): IsUndefined;
        isUndefined(): IsUndefined;

        /**
         * Fails a test with the given message.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.AssertionFailedException}
         */
        static fail(message?: string): never
        fail(message?: string): never

        /**
         * Marks current test as skipped and stops execution.
         */
        static markTestSkipped(message?: string): never;
        markTestSkipped(message?: string): never;

        /**
         * Return the current assertion count.
         */
        static getCount(): number;

        /**
         * Reset the assertion counter.
         */
        static resetCount(): void;
    }
}
