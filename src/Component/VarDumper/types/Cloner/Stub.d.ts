declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * Represents the main properties of a variable.
     */
    export class Stub {
        public static readonly TYPE_STRING = 1;
        public static readonly TYPE_ARRAY = 2;
        public static readonly TYPE_OBJECT = 3;
        public static readonly TYPE_SYMBOL = 4;

        /**
         * Variable type.
         */
        public type: number;

        /**
         * The object class.
         */
        public class_: string;

        /**
         * The real value.
         */
        public value: any;

        /**
         * Object id (handle).
         */
        public handle: number;

        /**
         * Ref counter.
         */
        public refCount: number;

        /**
         * Attributes.
         */
        public attr: any;

        /**
         * Constructor.
         */
        __construct(): void;
    }
}
