const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * Applies instanceof conditionals to definitions.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveInstanceofConditionalsPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        for (const [ IF, definition ] of __jymfony.getEntries(container.getAutoconfiguredInstanceof())) {
            if (0 < definition.getArguments().length) {
                throw new InvalidArgumentException(__jymfony.sprintf('Autoconfigured instanceof for type "%s" defines arguments but these are not supported and should be removed.', IF));
            }
        }

        for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition instanceof ChildDefinition) {
                // Don't apply "instanceof" to children: it will be applied to their parent
                continue;
            }

            container.setDefinition(id, this._processDefinition(container, id, definition));
        }
    }

    /**
     *
     * @param container
     * @param id
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     *
     * @private
     */
    _processDefinition(container, id, definition) {
        const instanceOfConditionals = definition.getInstanceofConditionals();
        const autoconfiguredInstanceof = definition.isAutoconfigured() ? container.getAutoconfiguredInstanceof() : {};
        if (0 === Object.keys(instanceOfConditionals).length && 0 === Object.keys(autoconfiguredInstanceof).length) {
            return definition;
        }

        const Class = container.parameterBag.resolveValue(definition.getClass());
        if (! Class) {
            return definition;
        }

        const conditionals = this._mergeConditionals(autoconfiguredInstanceof, instanceOfConditionals, container);

        definition.setInstanceofConditionals({});
        let parent = null, shared = null;
        const instanceofTags = [];
        const instanceofCalls = [];
        const instanceofShutdownCalls = [];

        for (const [ superclass, instanceofDefs ] of __jymfony.getEntries(conditionals)) {
            const reflClass = container.getReflectionClass(Class, false);
            if (superclass !== Class && ! reflClass) {
                continue;
            }

            if (superclass !== Class && ! reflClass.isSubclassOf(superclass)) {
                continue;
            }

            for (let [ key, instanceofDef ] of __jymfony.getEntries(instanceofDefs)) {
                /** @var ChildDefinition $instanceofDef */
                instanceofDef = __jymfony.clone(instanceofDef);
                instanceofDef.setAbstract(true).setParent(parent || '.abstract.instanceof.' + id);
                parent = '.instanceof.' + superclass + '.' + key + '.' + id;

                container.setDefinition(parent, instanceofDef);
                instanceofTags.push(instanceofDef.getTags());

                for (const methodCall of instanceofDef.getMethodCalls()) {
                    instanceofCalls.push(methodCall);
                }
                for (const methodCall of instanceofDef.getShutdownCalls()) {
                    instanceofShutdownCalls.push(methodCall);
                }

                instanceofDef.setTags({});
                instanceofDef.setMethodCalls([]);
                instanceofDef.setShutdownCalls([]);

                if (undefined !== instanceofDef.getChanges().shared) {
                    shared = instanceofDef.isShared();
                }
            }
        }

        if (parent) {
            const abstract = container.setDefinition('.abstract.instanceof.' + id, definition);

            // Cast Definition to ChildDefinition
            const childDef = new ChildDefinition(parent);
            Object.assign(childDef, definition);
            definition = childDef;

            if (null !== shared && undefined === definition.getChanges().shared) {
                definition.setShared(shared);
            }

            // Don't add tags to service decorators
            if (undefined === definition.getDecoratedService()) {
                let i = instanceofTags.length;
                while (0 <= --i) {
                    for (const [ k, value ] of __jymfony.getEntries(instanceofTags[i])) {
                        for (const v of value) {
                            if (definition.hasTag(k) && 0 < definition.getTag(k).filter(t => __jymfony.equal(v, t)).length) {
                                continue;
                            }

                            definition.addTag(k, v);
                        }
                    }
                }
            }

            definition.setMethodCalls([ ...instanceofCalls, ...definition.getMethodCalls() ]);
            definition.setShutdownCalls([ ...instanceofShutdownCalls, ...definition.getShutdownCalls() ]);

            // Reset fields with "merge" behavior
            abstract
                .setArguments([])
                .setMethodCalls([])
                .setShutdownCalls([])
                .setDecoratedService(null)
                .setTags({})
                .setAbstract(true);
        }

        return definition;
    }

    _mergeConditionals(autoconfiguredInstanceOf, instanceofConditionals, container) {
        const conditionals = {};
        for (const key of Object.keys(autoconfiguredInstanceOf)) {
            conditionals[key] = [ autoconfiguredInstanceOf[key] ];
        }

        // Make each value an array of ChildDefinition
        for (const [ superclass, instanceofDef ] of __jymfony.getEntries(instanceofConditionals)) {
            // Make sure the interface/class exists (but don't validate automaticInstanceofConditionals)
            if (! container.getReflectionClass(superclass)) {
                throw new RuntimeException(__jymfony.sprintf('"%s" is set as an "instanceof" conditional, but it does not exist.', superclass));
            }

            if (undefined === conditionals[superclass]) {
                conditionals[superclass] = [];
            }

            conditionals[superclass].push(instanceofDef);
        }

        return conditionals;
    }
}
