import { Type } from '@jymfony/decorators' optional;

/**
 * @memberOf Jymfony.Component.Autoloader.Reflection
 */
export default class ReflectionHelper {
    /**
     * Gets the ReflectionParameter Type metadata, if set
     *
     * @param {ReflectionParameter} parameter
     *
     * @returns {*}
     */
    static getParameterType(parameter) {
        if (undefined === Type) {
            return null;
        }

        return (parameter.metadata.find(([ t ]) => t === Type) || [])[1] || null;
    }
}
