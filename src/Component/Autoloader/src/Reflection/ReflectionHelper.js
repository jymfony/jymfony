import Type from '../Decorator/Type';

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

        return parameter.getAnnotations(Type)[0] || null;
    }
}
