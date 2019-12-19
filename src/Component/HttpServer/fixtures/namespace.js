const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Jymfony.Component.HttpServer.Tests = new Namespace(__jymfony.autoload, 'Jymfony.Component.HttpServer.Tests');

    /**
     * @namespace
     */
    Jymfony.Component.HttpServer.Tests.Fixtures = new Namespace(__jymfony.autoload, 'Jymfony.Component.HttpServer.Tests.Fixtures', __dirname);

    registered = true;
}
