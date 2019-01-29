const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;
const path = require('path');

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, this._getDefaultsParameters(), buildParameters)));

        this._methodMap = {
            "bar_service": "getBarServiceService",
            "foo_service": "getFooServiceService",
            "translator.loader_1": "getTranslator_Loader1Service",
            "translator.loader_2": "getTranslator_Loader2Service",
            "translator.loader_3": "getTranslator_Loader3Service",
            "translator_1": "getTranslator1Service",
            "translator_2": "getTranslator2Service",
            "translator_3": "getTranslator3Service",
        };

        this._aliases = {
        };

        this._privates = {};
    }

    compile() {
        throw new LogicException('You cannot compile a dumped container');
    }

    get frozen() {
        return true;
    }

    /**
     * Gets the public 'bar_service' shared service.
     *
     * @returns {stdClass}
     */
    getBarServiceService() {
        return this._services["bar_service"] = new stdClass((this._privates["baz_service"] || this.getBazServiceService()));
    }

    /**
     * Gets the public 'foo_service' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.ServiceLocator}
     */
    getFooServiceService() {
        return this._services["foo_service"] = new Jymfony.Component.DependencyInjection.ServiceLocator({"bar": () => {
            return (this._services["bar_service"] || this.getBarServiceService());
        }, "baz": () => {
            return (this._privates["baz_service"] || this.getBazServiceService());
        }, "nil": () => {
            return undefined;
        }});
    }

    /**
     * Gets the public 'translator.loader_1' shared service.
     *
     * @returns {stdClass}
     */
    getTranslator_Loader1Service() {
        return this._services["translator.loader_1"] = new stdClass();
    }

    /**
     * Gets the public 'translator.loader_2' shared service.
     *
     * @returns {stdClass}
     */
    getTranslator_Loader2Service() {
        return this._services["translator.loader_2"] = new stdClass();
    }

    /**
     * Gets the public 'translator.loader_3' shared service.
     *
     * @returns {stdClass}
     */
    getTranslator_Loader3Service() {
        return this._services["translator.loader_3"] = new stdClass();
    }

    /**
     * Gets the public 'translator_1' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.StubbedTranslator}
     */
    getTranslator1Service() {
        return this._services["translator_1"] = new Jymfony.Component.DependencyInjection.Fixtures.StubbedTranslator(new Jymfony.Component.DependencyInjection.ServiceLocator({"translator.loader_1": () => {
            return (this._services["translator.loader_1"] || this.getTranslator_Loader1Service());
        }}));
    }

    /**
     * Gets the public 'translator_2' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.StubbedTranslator}
     */
    getTranslator2Service() {
        let instance;
        this._services["translator_2"] = instance = new Jymfony.Component.DependencyInjection.Fixtures.StubbedTranslator(new Jymfony.Component.DependencyInjection.ServiceLocator({"translator.loader_2": () => {
            return (this._services["translator.loader_2"] || this.getTranslator_Loader2Service());
        }}));

        instance.addResource("db", (this._services["translator.loader_2"] || this.getTranslator_Loader2Service()), "nl");
        return instance;
    }

    /**
     * Gets the public 'translator_3' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.StubbedTranslator}
     */
    getTranslator3Service() {
        let $a = (this._services["translator.loader_3"] || this.getTranslator_Loader3Service());

        let instance;
        this._services["translator_3"] = instance = new Jymfony.Component.DependencyInjection.Fixtures.StubbedTranslator(new Jymfony.Component.DependencyInjection.ServiceLocator({"translator.loader_3": () => {
            return (this._services["translator.loader_3"] || this.getTranslator_Loader3Service());
        }}));

        instance.addResource("db", $a, "nl");
        instance.addResource("db", $a, "en");
        return instance;
    }

    /**
     * Gets the 'baz_service' shared service.
     *
     * @returns {stdClass}
     */
    getBazServiceService() {
        return this._privates["baz_service"] = new stdClass();
    }

    _getDefaultsParameters() {
        return {
        };
    }
}

module.exports = ProjectContainer;
