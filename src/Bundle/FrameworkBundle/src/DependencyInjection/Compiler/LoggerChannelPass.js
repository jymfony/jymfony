const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Alias = Jymfony.Component.DependencyInjection.Alias;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection.Compiler
 */
class LoggerChannelPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition('jymfony.logger')) {
            return;
        }

        /**
         * @type {string}
         *
         * @protected
         */
        this._currentId = undefined;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @protected
         */
        this._container = container;

        /**
         * @type {Set<string>}
         *
         * @private
         */
        this._channels = new Set();
        this._channels.add('app');

        for (const [ id, tags ] of __jymfony.getEntries(container.findTaggedServiceIds('jymfony.logger'))) {
            for (const tag of tags) {
                if (! tag.channel || 'app' === tag.channel) {
                    continue;
                }

                const resolvedChannel = container.parameterBag.resolveValue(tag.channel);
                this._channels.add(resolvedChannel);

                const loggerId = 'jymfony.logger.' + resolvedChannel;
                if (! container.hasDefinition(loggerId)) {
                    const definition = new ChildDefinition('jymfony.logger_prototype');
                    definition.replaceArgument(0, resolvedChannel);
                    container.setDefinition(loggerId, definition);
                }

                try {
                    this._loggerId = loggerId;
                    this._processValue(container.getDefinition(id), true);
                } finally {
                    this._loggerId = undefined;
                }
            }
        }

        for (const [ handler, channels ] of __jymfony.getEntries(container.getParameter('jymfony.logger.handlers_to_channels'))) {
            for (const channel of this._processChannels(channels)) {
                let logger;
                try {
                    logger = container.getDefinition('app' === channel ? 'jymfony.logger' : 'jymfony.logger.' + channel);
                } catch (e) {
                    const msg = 'Logger configuration error: The logging channel "' + channel + '" assigned to the "' + handler.substr(23) + '" handler does not exist.';
                    throw new InvalidArgumentException(msg, 0, e);
                }

                logger.addMethodCall('pushHandler', [ new Reference(handler) ]);
            }
        }

        container.setAlias('logger', new Alias('jymfony.logger', true));
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (value instanceof Reference && 'logger' === value.toString()) {
            return new Reference(this._loggerId, value.invalidBehavior);
        }

        return super._processValue(value, isRoot);
    }

    /**
     * @param {Object} configuration
     *
     * @returns {Generator}
     *
     * @private
     */
    * _processChannels(configuration) {
        if (! configuration) {
            yield * this._channels;
        }

        if ('inclusive' === configuration.type) {
            yield * (configuration.elements || this._channels);
        } else {
            for (const channel of this._channels) {
                if (-1 !== configuration.elements.indexOf(channel)) {
                    continue;
                }

                yield channel;
            }
        }
    }
}

module.exports = LoggerChannelPass;
