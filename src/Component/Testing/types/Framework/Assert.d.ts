declare namespace Jymfony.Component.Testing.Framework {
    export class Assert {
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
