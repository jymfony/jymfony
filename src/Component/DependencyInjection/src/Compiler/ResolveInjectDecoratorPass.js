import { Inject, Parameter } from '@jymfony/decorators' optional;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const DIParameter = Jymfony.Component.DependencyInjection.Parameter;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveInjectDecoratorPass extends AbstractRecursivePass {
    process(container) {
        if (undefined === Inject || undefined === Parameter) {
            // @jymfony/decorators is not installed.
            return;
        }

        super.process(container);
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (! (value instanceof Definition)) {
            return super._processValue(value, isRoot);
        }

        const class_ = value.getClass();
        if (! ReflectionClass.exists(class_)) {
            return value;
        }

        const reflClass = new ReflectionClass(class_);
        for (const field of reflClass.fields) {
            const reflField = reflClass.getField(field);
            for (const [ , annotation ] of reflField.metadata) {
                if (annotation instanceof Inject) {
                    value.addProperty(field, new Reference(annotation.serviceId, annotation.invalidBehavior));
                } else if (annotation instanceof Parameter) {
                    value.addProperty(field, new DIParameter(annotation.parameterName));
                }
            }
        }

        for (const property of reflClass.properties) {
            if (! reflClass.hasWritableProperty(property)) {
                continue;
            }

            const reflProperty = reflClass.getWritableProperty(property);
            for (const [ , annotation ] of reflProperty.metadata) {
                if (annotation instanceof Inject) {
                    value.addProperty(property, new Reference(annotation.serviceId, annotation.invalidBehavior));
                } else if (annotation instanceof Parameter) {
                    value.addProperty(property, new DIParameter(annotation.parameterName));
                }
            }
        }

        return value;
    }
}
