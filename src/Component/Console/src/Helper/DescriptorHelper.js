const TextDescriptor = Jymfony.Component.Console.Descriptor.TextDescriptor;
const JsonDescriptor = Jymfony.Component.Console.Descriptor.JsonDescriptor;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const Helper = Jymfony.Component.Console.Helper.Helper;

/**
 * @memberOf Jymfony.Component.Console.Helper
 */
class DescriptorHelper extends Helper {
    /**
     * Constructor.
     */
    __construct() {
        super.__construct();
        this._descriptors = {};

        this
            .register('txt', new TextDescriptor())
            // .register('xml', new XmlDescriptor())
            .register('json', new JsonDescriptor())
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
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {Object} object
     * @param {*} options
     *
     * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} when the given format is not supported
     */
    describe(output, object, options = {}) {
        options = Object.assign({
            raw_text: false,
            format: 'txt',
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
     * @param {Jymfony.Component.Console.Descriptor.DescriptorInterface} descriptor
     *
     * @returns {Jymfony.Component.Console.Helper.DescriptorHelper}
     */
    register(format, descriptor) {
        this._descriptors[format] = descriptor;

        return this;
    }
}

module.exports = DescriptorHelper;
