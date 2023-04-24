const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * Service tag to autoconfigure commands.
 *
 * @memberOf Jymfony.Component.Console.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS)
class AsCommand {
    /**
     * Constructor.
     *
     * @param {string} name
     * @param {string} [description]
     * @param {string[]} [aliases]
     * @param {boolean} [hidden]
     */
    __construct({ name, description = null, aliases = [], hidden = false }) {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {string}
         *
         * @private
         */
        this._description = description;

        if (!hidden && 0 === aliases.length) {
            return;
        }

        if (undefined === name) {
            throw new TypeError('Name must be defined in @AsCommand annotation');
        }

        const names = name.split('|');
        names.push(...aliases);

        if (hidden && '' !== name[0]) {
            names.unshift('');
        }

        this._name = names.join('|');
    }

    /**
     * @return {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @return {string}
     */
    get description() {
        return this._description;
    }
}
