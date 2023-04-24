const DummyQuery = Jymfony.Component.Messenger.Fixtures.DummyQuery;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyQueryHandler {
    __invoke(@Type(DummyQuery) message) {
    }
}
