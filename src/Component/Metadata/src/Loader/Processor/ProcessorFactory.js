const CompositeProcessor = Jymfony.Component.Metadata.Loader.Processor.CompositeProcessor;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const Processor = Jymfony.Component.Metadata.Annotation.Processor;
const ProcessorFactoryInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorFactoryInterface;
const ProcessorInterface = Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface;

/**
 * @memberOf Jymfony.Component.Metadata.Loader.Processor
 */
export default class ProcessorFactory extends implementationOf(ProcessorFactoryInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type Object.<string, string|string[]>
         *
         * @private
         */
        this._processors = {};

        /**
         * @type Object.<string, {Jymfony.Component.Metadata.Processor.ProcessorInterface}>
         *
         * @private
         */
        this._instances = {};
    }

    /**
     * Register a processor class for class.
     *
     * @param {string} metadataClass
     * @param {string} processorClass
     */
    registerProcessor(metadataClass, processorClass) {
        try {
            metadataClass = ReflectionClass.getClassName(metadataClass);
        } catch {
            // Do nothing.
        }

        if (! (new ReflectionClass(processorClass)).isSubclassOf(ProcessorInterface)) {
            throw InvalidArgumentException.create('"%s" is not a valid ProcessorInterface class', processorClass);
        }

        if (! this._processors[metadataClass]) {
            this._processors[metadataClass] = processorClass;
        } else if (! isArray(this._processors[metadataClass])) {
            this._processors[metadataClass] = [ this._processors[metadataClass], processorClass ];
        } else {
            this._processors[metadataClass].push(processorClass);
        }
    }

    /**
     * Register processors from theirs metadata.
     *
     * @param {(string|Function)[]} processors
     */
    registerProcessors(processors) {
        for (const processor of processors) {
            const reflClass = new ReflectionClass(processor);
            const p = reflClass.metadata.find(([ , t ]) => t instanceof Processor);
            if (! p) {
                continue;
            }

            this.registerProcessor(p[1].target, reflClass.name);
        }
    }

    /**
     * @inheritdoc
     */
    getProcessor(subject) {
        if (isObject(subject) || isFunction(subject)) {
            subject = ReflectionClass.getClassName(subject);
        }

        if (! this._processors[subject]) {
            return null;
        }

        if (!! this._instances[subject]) {
            return this._instances[subject];
        }

        const processor = this._processors[subject];
        if (isArray(processor)) {
            return this._instances[subject] = this._createComposite(processor);
        }

        return this._instances[subject] = new ReflectionClass(processor).newInstance();
    }

    /**
     * Create a CompositeProcessor instance.
     *
     * @param {Jymfony.Component.Metadata.Loader.Processor.ProcessorInterface[]} processors
     *
     * @returns {Jymfony.Component.Metadata.Loader.Processor.CompositeProcessor}
     *
     * @private
     */
    _createComposite(processors) {
        return new CompositeProcessor(processors.map(p => new p()));
    }
}
