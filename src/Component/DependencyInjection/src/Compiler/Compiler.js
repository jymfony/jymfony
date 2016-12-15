const PassConfig = Jymfony.DependencyInjection.Compiler.PassConfig;
const ServiceReferenceGraph = Jymfony.DependencyInjection.Compiler.ServiceReferenceGraph;
const LogFormatter = Jymfony.DependencyInjection.Compiler.LogFormatter;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 */
module.exports = class Compiler {
    constructor() {
        this._passConfig = new PassConfig();
        this._referenceGraph = new ServiceReferenceGraph();
        this._logFormatter = new LogFormatter();

        this._logs = [];
    }

    /**
     * Compile container processing all compiler passes
     *
     * @param {ContainerBuilder} container
     */
    compile(container) {
        for (let pass of this._passConfig.getPasses()) {
            pass.process(container);
        }
    }

    /**
     * Add a compilation pass
     *
     * @param {CompilerPassInterface} pass
     * @param type
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
     * @returns {Jymfony.DependencyInjection.Compiler.ServiceReferenceGraph}
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
     * @returns {Jymfony.DependencyInjection.Compiler.LogFormatter}
     */
    get logFormatter() {
        return this._logFormatter;
    }
};
