declare namespace Jymfony.Component.Security.Firewall {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * FirewallMap allows configuration of different firewalls for specific parts of the application.
     */
    export class FirewallMap extends implementationOf(FirewallMapInterface) {
        private _map: FirewallConfig[];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Adds a firewall to this map.
         *
         * @param {Jymfony.Component.Security.Firewall.FirewallConfig} config
         */
        add(config: FirewallConfig): void;

        /**
         * @inheritdoc
         */
        getConfig(request: Request): FirewallConfig;
    }
}
