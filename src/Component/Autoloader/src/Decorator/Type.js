/**
 * @memberOf Jymfony.Component.Autoloader.Decorator
 */
export default function Type(T) {
    return function(_, context) {
        const parameterIndex = context.parameterIndex === undefined ? null : context.parameterIndex;
        if (null === parameterIndex) {
            throw new Exception('Type decorator could be used on parameters only');
        }

        MetadataStorage.defineMetadata(Type, T, context.metadataKey, parameterIndex);
    };
}
