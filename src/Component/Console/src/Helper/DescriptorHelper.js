const TextDescriptor = Jymfony.Console.Descriptor.TextDescriptor;
const InvalidArgumentException = Jymfony.Console.Exception.InvalidArgumentException;
const Helper = Jymfony.Console.Helper.Helper;

/**
 * @memberOf Jymfony.Console.Helper
 * @type DescriptorHelper
 */
module.exports = class DescriptorHelper extends Helper {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this._descriptors = {};

        this
            .register('txt', new TextDescriptor())
            // .register('xml', new XmlDescriptor())
            // .register('json', new JsonDescriptor())
            // .register('md', new MarkdownDescriptor())
        ;
    }

    /**
     * Describes an object if supported.
     *
     * Available options are:
     * * format: string, the output format name
     * * raw_text: boolean, sets output type as raw
     *
     * @param {Jymfony.Console.Output.OutputInterface} output
     * @param {Object} object
     * @param {*} options
     *
     * @throws {Jymfony.Console.Exception.InvalidArgumentException} when the given format is not supported
     */
    describe(output, object, options = {}) {
        options = Object.assign({
            raw_text: false,
            format: 'txt'
        }, options);

        if (! this._descriptors[options.format]) {
            throw new InvalidArgumentException(`Unsupported format "${options.format}".`);
        }

        let descriptor = this._descriptors[options.format];
        descriptor.describe(output, object, options);
    }

    /**
     * Registers a descriptor.
     *
     * @param {string} format
     * @param {Jymfony.Console.Descriptor.DescriptorInterface} descriptor
     *
     * @returns {Jymfony.Console.Helper.DescriptorHelper}
     */
    register(format, descriptor) {
        this._descriptors[format] = descriptor;

        return this;
    }

    /**
     * @inheritDoc
     */
    get name() {
        return 'descriptor';
    }
};
