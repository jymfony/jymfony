const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;
const path = require('path');

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, this._getDefaultsParameters(), buildParameters)));

        this._methodMap = {
            "bar": "getBarService",
            "foo": "getFooService",
            "foo.baz": "getFoo_BazService",
            "foo.mbaz": "getFoo_MbazService",
            "foo.mbaz.property": "getFoo_Mbaz_PropertyService",
            "foo.mbaz.simple": "getFoo_Mbaz_SimpleService",
            "foo_bar": "getFooBarService",
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
     * Gets the public 'bar' shared service.
     *
     * @returns {Bar.FooClass}
     */
    getBarService() {
        let $a = (this._services["foo.baz"] || this.getFoo_BazService());

        let instance;
        this._services["bar"] = instance = new Bar.FooClass("foo", $a);

        $a.configure(instance);
        return instance;
    }

    /**
     * Gets the public 'foo' shared service.
     *
     * @returns {Bar.Foo}
     */
    getFooService() {
        let $a = (this._services["foo.baz"] || this.getFoo_BazService());

        let instance;
        this._services["foo"] = instance = Bar.FooFactory.getInstance("foo", $a, {"bar": "foo is bar", "foobar": "bar"}, true, this);

        instance.foo = "bar";
        instance.moo = $a;
        instance.qux = {"bar": "foo is bar", "foobar": "bar"};
        instance.setBar((this._services["bar"] || this.getBarService()));
        instance.initialize();
        this.registerShutdownCall(instance.shut.bind(instance, "shut_arg"));
        sc_configure(instance);
        return instance;
    }

    /**
     * Gets the public 'foo.baz' shared service.
     *
     * @returns {BazClass}
     */
    getFoo_BazService() {
        let instance;
        this._services["foo.baz"] = instance = BazClass.getInstance();

        BazClass.configureStatic1(instance);
        return instance;
    }

    /**
     * Gets the public 'foo.mbaz' shared service.
     *
     * @returns {BazClass}
     */
    getFoo_MbazService() {
        return this._services["foo.mbaz"] = new BazClass(require("BazClass"), new (require("BazClass")["getInstance"])());
    }

    /**
     * Gets the public 'foo.mbaz.property' shared service.
     *
     * @returns {BazClass}
     */
    getFoo_Mbaz_PropertyService() {
        return this._services["foo.mbaz.property"] = new (require("BazClass")["getInstance"])();
    }

    /**
     * Gets the public 'foo.mbaz.simple' shared service.
     *
     * @returns {BazClass}
     */
    getFoo_Mbaz_SimpleService() {
        return this._services["foo.mbaz.simple"] = require("BazClass");
    }

    /**
     * Gets the public 'foo_bar' service.
     *
     * @returns {Bar.FooClass}
     */
    getFooBarService() {
        let instance;
        return instance = new Bar.FooClass();
    }

    _getDefaultsParameters() {
        return {
            "baz.class": "BazClass",
            "foo_class": "Bar.FooClass",
            "foo": "bar",
        };
    }
}

module.exports = ProjectContainer;
