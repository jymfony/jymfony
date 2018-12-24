const TemplateReferenceInterface = Jymfony.Component.Templating.TemplateReferenceInterface;

/**
 * Interface to be implemented by all templates.
 *
 * @memberOf Jymfony.Component.Templating
 */
class TemplateReference extends implementationOf(TemplateReferenceInterface) {
    /**
     * Constructor.
     *
     * @param {string} [name]
     * @param {string} [engine]
     */
    __construct(name = undefined, engine = undefined) {
        this._parameters = { name, engine };
    }

    /**
     * @inheritDoc
     */
    all() {
        return __jymfony.clone(this._parameters);
    }

    /**
     * @inheritDoc
     */
    set(name, value) {
        if (this._parameters.hasOwnProperty(name)) {
            this._parameters[name] = value;
        } else {
            throw new InvalidArgumentException(__jymfony.sprintf('The template does not support the "%s" parameter.', name));
        }

        return this;
    }

    /**
     * @inheritDoc
     */
    get(name) {
        if (this._parameters.hasOwnProperty(name)) {
            return this._parameters[name];
        }

        throw new InvalidArgumentException(__jymfony.sprintf('The template does not support the "%s" parameter.', name));
    }

    /**
     * @inheritDoc
     */
    get name() {
        return this._parameters.name;
    }

    /**
     * @inheritDoc
     */
    toString() {
        return this.name;
    }
}

module.exports = TemplateReference;
