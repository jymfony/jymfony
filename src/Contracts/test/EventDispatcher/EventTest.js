const Event = Jymfony.Contracts.EventDispatcher.Event;
const expect = require('chai').expect;

describe('[Contracts] Event', function () {
    it('stop propagation flag is falsy at construction', () => {
        const event = new Event();
        expect(event.isPropagationStopped()).to.be.false;
    });

    it('stop propagation flag should be set correctly', () => {
        const event = new Event();
        expect(event.isPropagationStopped()).to.be.false;

        event.stopPropagation();
        expect(event.isPropagationStopped()).to.be.true;
    });
});
