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

    export class Assert {
        /**
         * Asserts that two variables are equal.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertEquals(expected: any, actual: any, message?: string): void;
        assertEquals(expected: any, actual: any, message?: string): void;

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
         * Asserts that a value is greater than another value.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertGreaterThan(expected: any, actual: any, message?: string): void;
        assertGreaterThan(expected: any, actual: any, message?: string): void;

        /**
         * Asserts that a string (needle) is contained in another string (haystack).
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertStringContainsString(needle: string, haystack: string, message?: string): void;
        assertStringContainsString(needle: string, haystack: string, message?: string);

        /**
         * Evaluates a Constraint matcher object.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        static assertThat(value: any, constraint: Constraint, message?: string): void;
        assertThat(value: any, constraint: Constraint, message?: string): void;

        static logicalNot(constraint: Constraint): LogicalNot;
        logicalNot(constraint: Constraint): LogicalNot;

        static greaterThan(value: any): GreaterThan;
        greaterThan(value: any): GreaterThan;

        static lessThan(value: any): LessThan;
        lessThan(value: any): LessThan;

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
