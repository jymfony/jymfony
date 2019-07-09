declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * DumperInterface used by Data objects.
     */
    export class DumperInterface {
        public static readonly definition: Newable<DumperInterface>;

        /**
         * Dumps a scalar value.
         *
         * @param cursor The Cursor position in the dump
         * @param type The PHP type of the value being dumped
         * @param value The scalar value being dumped
         */
        dumpScalar(cursor: Cursor, type: string, value: string|number|boolean): void;

        /**
         * Dumps a string.
         *
         * @param cursor The Cursor position in the dump
         * @param str The string being dumped
         * @param cut The number of characters $str has been cut by
         */
        dumpString(cursor: Cursor, str: string, cut: number): void;

        /**
         * Dumps while entering an hash.
         *
         * @param cursor The Cursor position in the dump
         * @param type A Stub.TYPE_* const for the type of hash
         * @param class_ The object class, resource type or array count
         * @param hasChild When the dump of the hash has child item
         */
        enterHash(cursor: Cursor, type: number, class_: string, hasChild: boolean): void;

        /**
         * Dumps while leaving an hash.
         *
         * @param cursor The Cursor position in the dump
         * @param type A Stub.TYPE_* const for the type of hash
         * @param class_ The object class, resource type or array count
         * @param hasChild When the dump of the hash has child item
         * @param cut The number of items the hash has been cut by
         */
        leaveHash(cursor: Cursor, type: number, class_: string, hasChild: boolean, cut: number): void;
    }
}
