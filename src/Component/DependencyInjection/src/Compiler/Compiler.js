const PassConfig = Jymfony.Component.DependencyInjection.Compiler.PassConfig;
const ServiceReferenceGraph = Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph;
const LogFormatter = Jymfony.Component.DependencyInjection.Compiler.LogFormatter;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class Compiler {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.PassConfig}
         *
         * @private
         */
        this._passConfig = new PassConfig();

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph}
         *
         * @private
         */
        this._referenceGraph = new ServiceReferenceGraph();

        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.LogFormatter}
         *
         * @private
         */
        this._logFormatter = new LogFormatter();

        /**
         * @type {Array}
         *
         * @private
         */
        this._logs = [];
    }

    /**
     * Compile container processing all compiler passes
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    compile(container) {
        for (const pass of this._passConfig.getPasses()) {
            if (container.isTrackingResources()) {
                container.addObjectResource(pass);
            }

            pass.process(container);
        }
    }

    /**
     * Add a compilation pass
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} type
     * @param {int} priority
     */
    addPass(pass, type, priority) {
        this._passConfig.addPass(pass, type, priority);
    }

    /**
     * Adds log message to log queue
     *
     * @param {string} message
     */
    addLogMessage(message) {
        this._logs.push(message);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} message
     *
     * @final
     */
    log(pass, message) {
        if (-1 !== message.indexOf('\n')) {
            message = __jymfony.trim(message).replace('\n', '\n' + pass.constructor.name + ': ');
        }

        this.addLogMessage(pass.constructor.name + ': ' + message);
    }

    /**
     * @returns {Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraph}
     */
    getServiceReferenceGraph() {
        return this._referenceGraph;
    }

    /**
     * Get log messages
     *
     * @returns {string[]}
     */
    getLogs() {
        return [ ...this._logs ];
    }

    /**
     * Get the compiler log formatter
     *
     * @returns {Jymfony.Component.DependencyInjection.Compiler.LogFormatter}
     */
    get logFormatter() {
        return this._logFormatter;
    }
}
