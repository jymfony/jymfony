declare namespace Jymfony.Component.VarDumper.Caster {
    /**
     * Helper for filtering out properties in casters.
     *
     * @final
     */
    export class Caster {
        public static readonly EXCLUDE_VERBOSE = 1;
        public static readonly EXCLUDE_NULL = 2;
        public static readonly EXCLUDE_EMPTY = 4;
        public static readonly EXCLUDE_NOT_IMPORTANT = 8;
        public static readonly EXCLUDE_STRICT = 16;
        public static readonly EXCLUDE_PUBLIC = 32;
        public static readonly EXCLUDE_DYNAMIC = 64;
        public static readonly EXCLUDE_VIRTUAL = 128;

        public static readonly PREFIX_VIRTUAL = '\0~\0';
        public static readonly PREFIX_DYNAMIC = '\0+\0';

        /**
         * Casts objects to arrays and adds the dynamic property prefix.
         *
         * @param obj The object to cast
         * @param hasDebugInfo Whether the __debugInfo method exists on $obj or not
         *
         * @returns The object-literal-cast of the object, with prefixed dynamic properties
         */
        static castObject(obj: any, hasDebugInfo?: boolean): any

        /**
         * Filters out the specified properties.
         *
         * By default, a single match in the $filter bit field filters properties out, following an "or" logic.
         * When EXCLUDE_STRICT is set, an "and" logic is applied: all bits must match for a property to be removed.
         *
         * @param a The object containing the properties to filter
         * @param filter A bit field of Caster::EXCLUDE_* constants specifying which properties to filter out
         * @param listedProperties List of properties to exclude when Caster::EXCLUDE_VERBOSE is set, and to preserve when Caster::EXCLUDE_NOT_IMPORTANT is set
         *
         * @returns The filtered object and the count of the removed properties.
         */
        static filter(a: any, filter: number, listedProperties?: string[]): [any, number];
    }
}
