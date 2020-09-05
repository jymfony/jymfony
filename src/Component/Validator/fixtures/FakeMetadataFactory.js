const MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;
const NoSuchMetadataException = Jymfony.Component.Validator.Exception.NoSuchMetadataException;

export default class FakeMetadataFactory extends implementationOf(MetadataFactoryInterface) {
    __construct() {
        this._metadatas = {};
        this._objectMetadatas = new WeakMap();
    }

    getMetadataFor($class) {
        const className = ReflectionClass.getClassName($class);
        if (undefined === this._metadatas[className]) {
            if (this._objectMetadatas.has($class)) {
                return this._objectMetadatas.get($class);
            }

            throw new NoSuchMetadataException(__jymfony.sprintf('No metadata for "%s"', className));
        }

        return this._metadatas[className];
    }

    hasMetadataFor($class) {
        const className = ReflectionClass.getClassName($class);

        return undefined !== this._metadatas[className] || this._objectMetadatas.has($class);
    }

    addMetadata(metadata) {
        this._metadatas[metadata.name] = metadata;
    }

    addMetadataForValue(value, metadata) {
        if (isFunction(value)) {
            value = ReflectionClass.getClassName(value);
        } else if (isObject(value)) {
            this._objectMetadatas.set(value, metadata);
            return;
        }

        this._metadatas[value] = metadata;
    }
}
