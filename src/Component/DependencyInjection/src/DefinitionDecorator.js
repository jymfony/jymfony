const Definition = Jymfony.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.DependencyInjection
 * @type {Jymfony.DependencyInjection.DefinitionDecorator}
 */
module.exports = class DefinitionDecorator extends Definition {
    /**
     * Create a new DefinitionDecorator
     *
     * @param {Jymfony.DependencyInjection.Definition} parent
     */
    constructor(parent) {
        super();

        this._parent = parent;
        this._changes = {};
        this._replacedArguments = {};
    }

    /**
     * Get decorated definition
     *
     * @return {Jymfony.DependencyInjection.Definition}
     */
    getParent() {
        return this._parent;
    }

    /**
     * Return all changes tracked for the Definition object
     *
     * @returns {Object}
     */
    getChanges() {
        return Object.assign({}, this._changes);
    }

    /**
     * @inheritDoc
     */
    setClass(class_) {
        this._changes['class'] = true;

        return super.setClass(class_);
    }

    /**
     * @inheritDoc
     */
    setFactory(factory) {
        this._changes['factory'] = true;

        return super.setFactory(factory);
    }

    /**
     * @inheritDoc
     */
    setConfigurator(configurator) {
        this._changes['configurator'] = true;

        return super.setConfigurator(configurator);
    }

    /**
     * @inheritDoc
     */
    setFile(file) {
        this._changes['file'] = true;

        return super.setFile(file);
    }

    /**
     * @inheritDoc
     */
    setPublic(public_) {
        this._changes['public'] = true;

        return super.setPublic(public_);
    }

    /**
     * @inheritDoc
     */
    setLazy(lazy) {
        this._changes['lazy'] = true;

        return super.setLazy(lazy);
    }

    /**
     * @inheritDoc
     */
    setDecoratedService(id, renamedId = undefined, priority = 0) {
        this._changes['decorated_service'] = true;

        return super.setDecoratedService(id, renamedId, priority);
    }

    /**
     * @inheritDoc
     */
    setDeprecated(status = true, template = undefined) {
        this._changes['deprecated'] = true;

        return super.setDeprecated(status, template);
    }

    /**
     * @inheritDoc
     */
    getArguments() {
        let args = [ ...this._arguments ];
        for (let [k, v] of this._replacedArguments) {
            if (k >= args.length) {
                continue;
            }

            args[k] = v;
        }

        return __jymfony.deepClone(args);
    }

    /**
     * @inheritDoc
     */
    getArgument(index) {
        if (this._replacedArguments.hasOwnProperty(index)) {
            return this._replacedArguments(index);
        }

        return super.getArgument(index);
    }

    /**
     * @inheritDoc
     */
    replaceArgument(index, argument) {
        this._replacedArguments[index] = argument;

        return this;
    }
};
