declare namespace Jymfony.Component.Routing.Loader.Configurator {
    import RouteTrait = Jymfony.Component.Routing.Loader.Configurator.Traits.RouteTrait;
    import RouteCollection = Jymfony.Component.Routing.RouteCollection;

    export class ImportConfigurator extends implementationOf(RouteTrait) {
        private _parent: RouteCollection;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(parent: RouteCollection, route: RouteCollection): void;
        constructor(parent: RouteCollection, route: RouteCollection);

        /**
         * @inheritdoc
         */
        build(): RouteCollection;

        /**
         * Sets the prefix to add to the path of all child routes.
         *
         * @final
         */
        prefix(prefix: string | Record<string, string>, trailingSlashOnRoot?: boolean): this;

        /**
         * Sets the prefix to add to the name of all child routes.
         *
         * @param {string} namePrefix
         *
         * @returns {Jymfony.Component.Routing.Loader.Configurator.ImportConfigurator}
         */
        namePrefix(namePrefix: string): this;
    }
}
