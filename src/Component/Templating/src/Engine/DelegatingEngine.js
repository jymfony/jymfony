const EngineInterface = Jymfony.Component.Templating.Engine.EngineInterface;

/**
 * DelegatingEngine selects an engine for a given template.
 *
 * @memberOf Jymfony.Component.Templating.Engine
 */
export default class DelegatingEngine extends implementationOf(EngineInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Templating.Engine.EngineInterface[]} [engines=[]] An array of EngineInterface instances to add
     */
    __construct(engines = []) {
        /**
         * @type {Jymfony.Component.Templating.Engine.EngineInterface[]}
         *
         * @protected
         */
        this._engines = [];

        for (const engine of engines) {
            this.addEngine(engine);
        }
    }

    /**
     * Adds an engine.
     *
     * @param {Jymfony.Component.Templating.Engine.EngineInterface} engine
     */
    addEngine(engine) {
        this._engines.push(engine);
    }

    /**
     * @inheritdoc
     */
    render(out, name, parameters = {}) {
        return this.getEngine(name)
            .render(out, name, parameters);
    }

    /**
     * @inheritdoc
     */
    async exists(name) {
        try {
            return this.getEngine(name).exists(name);
        } catch {
            return false;
        }
    }

    /**
     * @inheritdoc
     */
    supports(name) {
        return this.getEngine(name).supports(name);
    }

    /**
     * Get an engine able to render the given template.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name A template name or a TemplateReferenceInterface instance
     *
     * @returns {Jymfony.Component.Templating.Engine.EngineInterface} The engine
     *
     * @throws {RuntimeException} if no engine able to work with the template is found
     */
    getEngine(name) {
        for (const engine of this._engines) {
            if (engine.supports(name)) {
                return engine;
            }
        }

        throw new RuntimeException(__jymfony.sprintf('No engine is able to work with the template "%s".', name));
    }
}
