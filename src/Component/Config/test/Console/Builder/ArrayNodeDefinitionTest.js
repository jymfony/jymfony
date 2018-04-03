const Builder = Jymfony.Component.Config.Definition.Builder;
const Exception = Jymfony.Component.Config.Definition.Exception;
const expect = require('chai').expect;

describe('[Config] ArrayNodeDefinition', function () {
    it('should append nodes', () => {
        const parent = new Builder.ArrayNodeDefinition('root');
        const child = new Builder.ScalarNodeDefinition('child');

        /* eslint-disable indent */
        parent
            .children()
                .scalarNode('foo').end()
                .scalarNode('bar').end()
            .end()
            .append(child)
        ;
        /* eslint-enabled indent */

        expect(Object.keys(parent._children)).to.have.lengthOf(3);
        expect(Object.values(parent._children)).to.include(child);
    });

    const providePrototypeNodeSpecificCalls = function * providePrototypeNodeSpecificCalls() {
        yield [ 'defaultValue', [ [] ] ];
        yield [ 'addDefaultChildrenIfNoneSet', [] ];
        yield [ 'requiresAtLeastOneElement', [] ];
        yield [ 'cannotBeEmpty', [] ];
        yield [ 'useAttributeAsKey', [ 'foo' ] ];
    };

    let key = 0;
    for (const test of providePrototypeNodeSpecificCalls()) {
        it('prototype node specific call with dataset #'+(key++), () => {
            const [ method, args ] = test;
            const node = new Builder.ArrayNodeDefinition('root');
            node[method](...args);

            expect(node.getNode.bind(node))
                .to.throw(Exception.InvalidDefinitionException);
        });
    }
});
