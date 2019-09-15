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
            "factory": "getFactoryService",
            "factory_with_static_call": "getFactoryWithStaticCallService",
            "invokable_factory": "getInvokableFactoryService",
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
     * Gets the public 'factory' shared service.
     *
     * @returns {FooBarClass}
     */
    getFactoryService() {
        return this._services["factory"] = (new BazClass()).getClass();
    }

    /**
     * Gets the public 'factory_with_static_call' shared service.
     *
     * @returns {FooBarClass}
     */
    getFactoryWithStaticCallService() {
        return this._services["factory_with_static_call"] = FooBacFactory.createFooBar();
    }

    /**
     * Gets the public 'invokable_factory' shared service.
     *
     * @returns {FooBarClass}
     */
    getInvokableFactoryService() {
        return this._services["invokable_factory"] = (this._services["factory"] || this.getFactoryService()).__invoke();
    }

    _getDefaultsParameters() {
        return {
        };
    }
}

module.exports = ProjectContainer;
