declare namespace Jymfony.Component.Routing {
    import WarmableInterface = Jymfony.Component.Kernel.CacheWarmer.WarmableInterface;

    /**
     * RouterInterface is the interface that all Router classes must implement.
     * This interface is the concatenation of UrlMatcherInterface and UrlGeneratorInterface.
     */
    export class RouterInterface extends WarmableInterface.definition {
    }
}
