/**
 * Exception class for when a resource cannot be loaded or imported.
 *
 * @memberOf Jymfony.Component.Config.Exception
 */
class FileLoaderLoadException extends Exception {
    /**
     * Constructor.
     *
     * @param {*} resource
     * @param {*} [sourceResource]
     * @param {null|int} [code = null]
     * @param {Exception} [previous]
     * @param {string} [type]
     */
    __construct(resource, sourceResource = undefined, code = null, previous = undefined, type = undefined) {
        let message = '';
        if (previous) {
            // Include the previous exception, to help the user see what might be the underlying cause
            // Trim the trailing period of the previous message. We only want 1 period remove so no rtrim...
            if ('.' === previous.message.substr(-1)) {
                message += previous.message.substr(0, -1)+' in ';
            } else {
                message += previous.message+' in ';
            }

            message += resource.toString()+' ';

            // Show tweaked trace to complete the human readable sentence
            if (! sourceResource) {
                message += __jymfony.sprintf('(which is loaded in resource "%s")', FileLoaderLoadException.varToString(resource));
            } else {
                message += __jymfony.sprintf('(which is being imported from "%s")', FileLoaderLoadException.varToString(sourceResource));
            }

            message += '.';
        } else if (undefined === sourceResource) {
            message = __jymfony.sprintf('Cannot load resource "%s".', FileLoaderLoadException.varToString(resource));
        } else {
            message = __jymfony.sprintf('Cannot import resource "%s" from "%s".', FileLoaderLoadException.varToString(resource), FileLoaderLoadException.varToString(sourceResource));
        }

        // Is the resource located inside a bundle?
        if (isString(resource) && '@' === resource.charAt(0)) {
            const bundle = resource.substr(resource.split('/'), 1);
            message += __jymfony.sprintf(' Make sure the "%s" bundle is correctly registered and loaded in the application kernel class.', bundle);
            message += __jymfony.sprintf(' If the bundle is registered, make sure the bundle path "%s" is not empty.', resource);
        } else if (type) {
            // Maybe there is no loader for this specific type
            message += __jymfony.sprintf(' Make sure there is a loader supporting the "%s" type.', type);
        }

        super.__construct(message, code, previous);
    }

    /**
     * @param {*} variable
     *
     * @returns {string}
     */
    static varToString(variable) {
        if (isObject(variable)) {
            return __jymfony.sprintf('Object(%s)', variable.constructor.name);
        }

        if (isArray(variable)) {
            const a = [];
            for (const [ k, v ] of variable) {
                a.push(__jymfony.sprintf('%s => %s', k, FileLoaderLoadException.varToString(v)));
            }

            return __jymfony.sprintf('Array(%s)', a.join(', '));
        }

        return variable.toString();
    }
}

module.exports = FileLoaderLoadException;
