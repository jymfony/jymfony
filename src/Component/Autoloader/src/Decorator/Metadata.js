/**
 * @memberOf Jymfony.Component.Autoloader.Decorator
 */
export default function Metadata(key, value) {
    return function (target, context) {
        if (undefined === value && !! key && 'object' === typeof key) {
            value = key;
            key = value.constructor;
        }

        const parameterIndex = context.parameterIndex === undefined ? null : context.parameterIndex;

        if ('field' === context.kind) {
            throw new Error('Cannot set metadata on field, use "accessor" keyword instead.');
        } else {
            MetadataStorage.addMetadata(key, value, context.metadataKey, parameterIndex);
        }
    };
}
