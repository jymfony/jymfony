declare namespace Jymfony.Component.PropertyAccess {
    import CacheItemPoolInterface = Jymfony.Component.Cache.CacheItemPoolInterface;

    interface AccessInfo {
        type: string;
        name: string;
    }

    export class PropertyAccessor extends implementationOf(PropertyAccessorInterface) {
        public static readonly ACCESS_TYPE_METHOD = 'method';
        public static readonly ACCESS_TYPE_PROPERTY = 'property';
        public static readonly ACCESS_TYPE_NOT_FOUND = 'not_found';

        private _cacheItemPool: CacheItemPoolInterface<any>;

        /**
         * Constructor.
         */
        __construct(cacheItemPool?: CacheItemPoolInterface<any>): void;

        /**
         * @inheritdoc
         */
        getValue(object: object | any[], path: string | PropertyPathInterface): any;

        /**
         * @inheritdoc
         */
        setValue(object: object | any[], value: any, path: string | PropertyPathInterface): void;

        /**
         * Reads the path to a given path index.
         */
        private _readPropertiesUntil(object: object | any[], propertyPath: PropertyPathInterface, length: number): any;

        private _readProperty(object: object | any[], property: string): any;

        private _getReadAccessInfo(object: object | any[], property: string): AccessInfo;

        private _writeProperty(object: object | any[], property: string, value: any): void;

        private _getWriteAccessInfo(object: object | any[], property: string): AccessInfo;

        /**
         * Gets a PropertyPath instance and caches it.
         */
        private _getPropertyPath(path: string | PropertyPathInterface): PropertyPathInterface;

        /**
         * @param {string} string
         *
         * @returns {string}
         *
         * @private
         */
        private _camelize(string: string): string;
    }
}
