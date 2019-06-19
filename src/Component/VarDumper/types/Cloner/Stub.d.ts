declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * Represents the main properties of a variable.
     */
    export class Stub {
        public static readonly TYPE_REF = 1;
        public static readonly TYPE_STRING = 2;
        public static readonly TYPE_ARRAY = 3;
        public static readonly TYPE_OBJECT = 4;
        public static readonly TYPE_SYMBOL = 5;

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
