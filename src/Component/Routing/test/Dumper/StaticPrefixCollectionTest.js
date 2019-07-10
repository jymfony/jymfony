const StaticPrefixCollection = Jymfony.Component.Routing.Dumper.StaticPrefixCollection;
const Route = Jymfony.Component.Routing.Route;
const { expect } = require('chai');

describe('[Routing] StaticPrefixCollection', function () {
    function * routeProvider() {
        yield [ 'Simple - not nested', [
            [
                [ '/', 'root' ],
                [ '/prefix/segment', 'prefix_segment' ],
                [ '/leading/segment', 'leading_segment' ],
            ],
            `root
prefix_segment
leading_segment`,
        ] ];

        yield [ 'Nested - small group', [
            [
                [ '/', 'root' ],
                [ '/prefix/segment/aa', 'prefix_segment' ],
                [ '/prefix/segment/bb', 'leading_segment' ],
            ],
            `root
/prefix/segment/
-> prefix_segment
-> leading_segment`,
        ] ];

        yield [ 'Nested - contains item at intersection', [
            [
                [ '/', 'root' ],
                [ '/prefix/segment/', 'prefix_segment' ],
                [ '/prefix/segment/bb', 'leading_segment' ],
            ],
            `root
/prefix/segment/
-> prefix_segment
-> leading_segment`,
        ] ];

        yield [ 'Simple one level nesting', [
            [
                [ '/', 'root' ],
                [ '/group/segment/', 'nested_segment' ],
                [ '/group/thing/', 'some_segment' ],
                [ '/group/other/', 'other_segment' ],
            ],
            `root
/group/
-> nested_segment
-> some_segment
-> other_segment`,
        ] ];

        yield [ 'Retain matching order with groups', [
            [
                [ '/group/aa/', 'aa' ],
                [ '/group/bb/', 'bb' ],
                [ '/group/cc/', 'cc' ],
                [ '/(.*)', 'root' ],
                [ '/group/dd/', 'dd' ],
                [ '/group/ee/', 'ee' ],
                [ '/group/ff/', 'ff' ],
            ],
            `/group/
-> aa
-> bb
-> cc
root
/group/
-> dd
-> ee
-> ff`,
        ] ];

        yield [ 'Retain complex matching order with groups at base', [
            [
                [ '/aaa/111/', 'first_aaa' ],
                [ '/prefixed/group/aa/', 'aa' ],
                [ '/prefixed/group/bb/', 'bb' ],
                [ '/prefixed/group/cc/', 'cc' ],
                [ '/prefixed/(.*)', 'root' ],
                [ '/prefixed/group/dd/', 'dd' ],
                [ '/prefixed/group/ee/', 'ee' ],
                [ '/prefixed/', 'parent' ],
                [ '/prefixed/group/ff/', 'ff' ],
                [ '/aaa/222/', 'second_aaa' ],
                [ '/aaa/333/', 'third_aaa' ],
            ],
            `/aaa/
-> first_aaa
-> second_aaa
-> third_aaa
/prefixed/
-> /prefixed/group/
-> -> aa
-> -> bb
-> -> cc
-> root
-> /prefixed/group/
-> -> dd
-> -> ee
-> -> ff
-> parent`,
        ] ];

        yield [ 'Group regardless of segments', [
            [
                [ '/aaa-111/', 'a1' ],
                [ '/aaa-222/', 'a2' ],
                [ '/aaa-333/', 'a3' ],
                [ '/group-aa/', 'g1' ],
                [ '/group-bb/', 'g2' ],
                [ '/group-cc/', 'g3' ],
            ],
            `/aaa-
-> a1
-> a2
-> a3
/group-
-> g1
-> g2
-> g3`,
        ] ];
    }

    /**
     * @param {Jymfony.Component.Routing.Dumper.StaticPrefixCollection} collection
     * @param {string} prefix
     */
    const dumpCollection = (collection, prefix = '') => {
        const lines = [];

        for (const item of collection.routes) {
            if (item instanceof StaticPrefixCollection) {
                lines.push(prefix + item.prefix);
                lines.push(dumpCollection(item, prefix + '-> '));
            } else {
                lines.push(prefix + item.join(' '));
            }
        }

        return lines.join('\n');
    };

    for (const [ name, args ] of routeProvider()) {
        it('grouping: ' + name, () => {
            const [ routes, expected ] = args;
            const collection = new StaticPrefixCollection();

            for (const route of routes) {
                const [ path, name ] = route;
                const staticPrefix = (new Route(path)).compile().staticPrefix;

                collection.addRoute(staticPrefix, [ name ]);
            }

            expect(dumpCollection(collection)).to.be.equal(expected);
        });
    }
});
