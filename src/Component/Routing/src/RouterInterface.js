const WarmableInterface = Jymfony.Component.Kernel.CacheWarmer.WarmableInterface;

/**
 * RouterInterface is the interface that all Router classes must implement.
 * This interface is the concatenation of UrlMatcherInterface and UrlGeneratorInterface.
 *
 * @memberOf Jymfony.Component.Routing
 */
class RouterInterface extends WarmableInterface.definition {
}

module.exports = getInterface(RouterInterface);
