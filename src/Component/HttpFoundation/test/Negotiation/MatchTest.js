const Match = Jymfony.Component.HttpFoundation.Negotiation.Match;
const { expect } = require('chai');

describe('[HttpFoundation] Match', function () {
    const testsForCompare = [
        [ new Match(1.0, 110, 1), new Match(1.0, 111, 1), 0 ],
        [ new Match(0.1, 10, 1), new Match(0.1, 10, 2), -1 ],
        [ new Match(0.5, 110, 5), new Match(0.5, 11, 4), 1 ],
        [ new Match(0.4, 110, 1), new Match(0.6, 111, 3), 1 ],
        [ new Match(0.6, 110, 1), new Match(0.4, 111, 3), -1 ],
    ];

    for (const [ match1, match2, expected ] of testsForCompare) {
        it('compare should return the expected result', () => {
            expect(Match.compare(match1, match2)).to.be.equal(expected);
        });
    }

    const testsForReduce = [
        [
            { 1: new Match(1.0, 10, 1) },
            new Match(0.5, 111, 1),
            { 1: new Match(0.5, 111, 1) },
        ],
        [
            { 1: new Match(1.0, 110, 1) },
            new Match(0.5, 11, 1),
            { 1: new Match(1.0, 110, 1) },
        ],
        [
            { 0: new Match(1.0, 10, 1) },
            new Match(0.5, 111, 1),
            { 0: new Match(1.0, 10, 1), 1: new Match(0.5, 111, 1) },
        ],
    ];

    for (const [ carry, match, expected ] of testsForReduce) {
        it('reduce should work correctly', () => {
            expect(Match.reduce(carry, match)).to.be.deep.equal(expected);
        });
    }
});
