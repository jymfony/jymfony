declare namespace Jymfony.Component.Security.Firewall {
    import Request = Jymfony.Component.HttpFoundation.Request;

    export class FirewallMapInterface {
        /**
         * Returns the firewall configuration matching the request.
         */
        getConfig(request: Request): FirewallConfig;
    }
}
