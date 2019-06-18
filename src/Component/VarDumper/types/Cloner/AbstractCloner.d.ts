declare namespace Jymfony.Component.VarDumper.Cloner {
    /**
     * AbstractCloner implements a generic caster mechanism for objects and resources.
     */
    export abstract class AbstractCloner extends implementationOf(ClonerInterface) {
        /**
         * The maximum number of items to past past the minimum depth in nested structure.
         */
        protected _maxItems: number;

        /**
         * The maximum cloned length for strings.
         */
        protected _maxString: number;

        /**
         * The minimum tree depth where we are guaranteed to clone all the items. After this
         * depth is reached, only maxItems items will be cloned.
         */
        private _minDepth: number;

        /**
         * Class info cache.
         */
        private _classInfo: Record<string, [number, string[], boolean, { file: string }]>;

        /**
         * Filter.
         */
        private _filter: number;

        /**
         * Var casters.
         */
        private _casters: Map<Constructor, Invokable[]>;

        /**
         * Constructor.
         *
         * @param {Map.<Function, Function[]>} casters
         */
        __construct(casters?: Map<Constructor|string, Invokable>): void;

        /**
         * Add casters for objects.
         * Maps objects types to a callback.
         *
         * @param {Object.<string|symbol, Function>} casters
         */
        addCasters(casters: Map<Constructor|string, Invokable>|Record<Constructor|string, Invokable>);

        /**
         * Sets the maximum number of items to past past the minimum depth in nested structure.
         */
        public /* writeonly */ maxItems: number;

        /**
         * Sets the maximum cloned length for strings.
         */
        public /* writeonly */ maxString: number | undefined;

        /**
         * Sets the minimum tree depth where we are guaranteed to clone all the items.  After this
         * depth is reached, only maxItems items will be cloned.
         */
        public /* writeonly */ minDepth: number;

        /**
         * Clones a variable.
         */
        cloneVar(variable: any, filter?: number): Data;

        /**
         * Effectively clones the PHP variable.
         */
        protected abstract _doClone(variable: any): any;

        /**
         * Casts an object to an array representation.
         *
         * @param stub The Stub for the casted object
         * @param isNested True if the object is nested in the dumped structure
         *
         * @returns The object casted as array
         */
        protected _castObject(stub: Stub, isNested: boolean): any;
    }
}
