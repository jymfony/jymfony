import MetadataHelper from '../Metadata/MetadataHelper';

/**
 * @memberOf Jymfony.Component.Autoloader.Decorator
 */
export default function Type(T) {
    return function(_, context) {
        if ('parameter' !== context.kind) {
            throw new Exception('Type decorator could be used on parameters only');
        }

        MetadataStorage.defineMetadata(Type, T, MetadataHelper.getMetadataTarget(context));
    };
}
