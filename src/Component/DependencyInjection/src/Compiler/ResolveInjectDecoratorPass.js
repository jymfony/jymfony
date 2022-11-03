const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Inject = Jymfony.Component.DependencyInjection.Annotation.Inject;
const DIParameter = Jymfony.Component.DependencyInjection.Parameter;
const Parameter = Jymfony.Component.DependencyInjection.Annotation.Parameter;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveInjectDecoratorPass extends AbstractRecursivePass {
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
