const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Definition = Jymfony.Component.DependencyInjection.Definition;

const EmptyChildDefinition = new ChildDefinition('');
const EmptyChildDefinitionJSON = JSON.stringify(EmptyChildDefinition);

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @final
 */
export default class AnnotationAutoconfigurationPass extends AbstractRecursivePass {
    process(container) {
        if (0 === Object.keys(container.getAutoconfiguredAnnotations()).length) {
            return;
        }

        super.process(container);
    }

    _processValue(value, isRoot = false) {
        /** @type {ReflectionClass} classReflector */
        let classReflector;
        if (!(value instanceof Definition)
            || !value.isAutoconfigured()
            || value.isAbstract()
            || value.hasTag('container.ignore_attributes')
            || !(classReflector = this._container.getReflectionClass(value.getClass(), false))
        ) {
            return super._processValue(value, isRoot);
        }

        const instanceOf = value.getInstanceofConditionals();
        const conditionals = instanceOf[classReflector.name] || new ChildDefinition('');

        const configurators = this._container.getAutoconfiguredAnnotations();
        for (const [ klass, attribute ] of classReflector.metadata) {
            const className = ReflectionClass.getClassName(klass);
            const configurator = configurators[className];
            if (configurator) {
                configurator(conditionals, attribute, classReflector);
            }
        }

        /** @type {ReflectionMethod | null} */
        const constructorReflector = (() => {
            try {
                return this._getConstructor(value, false);
            } catch (e) {
                if (e instanceof RuntimeException) {
                    return null;
                }

                throw e;
            }
        })();

        if (null !== constructorReflector) {
            for (const parameter of constructorReflector.parameters) {
                for (const [ klass, attribute ] of parameter.metadata) {
                    const className = ReflectionClass.getClassName(klass);
                    const configurator = configurators[className];
                    if (configurator) {
                        configurator(conditionals, attribute, parameter);
                    }
                }
            }
        }

        for (const methodName of classReflector.methods) {
            const methodReflector = classReflector.getMethod(methodName);
            if (methodReflector.isPrivate) {
                continue;
            }

            for (const [ klass, attribute ] of methodReflector.metadata) {
                const className = ReflectionClass.getClassName(klass);
                const configurator = configurators[className];
                if (configurator) {
                    configurator(conditionals, attribute, methodReflector);
                }
            }
        }

        for (const fieldName of classReflector.fields) {
            const reflector = classReflector.getField(fieldName);
            if (reflector.isPrivate) {
                continue;
            }

            for (const [ klass, attribute ] of reflector.metadata) {
                const className = ReflectionClass.getClassName(klass);
                const configurator = configurators[className];
                if (configurator) {
                    configurator(conditionals, attribute, reflector);
                }
            }
        }

        for (const propertyName of classReflector.properties) {
            if (classReflector.hasWritableProperty(propertyName)) {
                const reflector = classReflector.getWritableProperty(propertyName);
                for (const [ klass, attribute ] of reflector.metadata) {
                    const className = ReflectionClass.getClassName(klass);
                    const configurator = configurators[className];
                    if (configurator) {
                        configurator(conditionals, attribute, reflector);
                    }
                }
            }

            if (classReflector.hasReadableProperty(propertyName)) {
                const reflector = classReflector.getReadableProperty(propertyName);
                for (const [ klass, attribute ] of reflector.metadata) {
                    const className = ReflectionClass.getClassName(klass);
                    const configurator = configurators[className];
                    if (configurator) {
                        configurator(conditionals, attribute, reflector);
                    }
                }
            }
        }

        if (!(instanceOf[classReflector.name]) && EmptyChildDefinitionJSON !== JSON.stringify(conditionals)) {
            instanceOf[classReflector.name] = conditionals;
            value.setInstanceofConditionals(instanceOf);
        }

        return super._processValue(value, isRoot);
    }
}
