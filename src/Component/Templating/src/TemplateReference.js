const TemplateReferenceInterface = Jymfony.Component.Templating.TemplateReferenceInterface;

/**
 * Internal representation of a template.
 *
 * @memberOf Jymfony.Component.Templating
 */
class TemplateReference extends implementationOf(TemplateReferenceInterface) {
    /**
     * Constructor.
     *
     * @param {string} [name] The logical name of the template
     * @param {string} [engine] The name of the engine
     */
    __construct(name = undefined, engine = undefined) {
        this._parameters = { name, engine };
    }

    /**
     * @inheritdoc
     */
    all() {
        return __jymfony.clone(this._parameters);
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    get(name) {
        if (this._parameters.hasOwnProperty(name)) {
            return this._parameters[name];
        }

        throw new InvalidArgumentException(__jymfony.sprintf('The template does not support the "%s" parameter.', name));
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._parameters.name;
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this.name;
    }
}

module.exports = TemplateReference;
