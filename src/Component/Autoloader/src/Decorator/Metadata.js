const MetadataHelper = require('../Metadata/MetadataHelper');

/**
 * @memberOf Jymfony.Component.Autoloader.Decorator
 */
export default function Metadata(key, value) {
    return function (target, context) {
        if (undefined === value && !! key && 'object' === typeof key) {
            value = key;
            key = value.constructor;
        }

        MetadataStorage.addMetadata(key, value, MetadataHelper.getMetadataTarget(context));
    };
}
