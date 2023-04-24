const DummyCommand = Jymfony.Component.Messenger.Fixtures.DummyCommand;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyCommandHandler {
    __invoke(@Type(DummyCommand) command) {
    }
}
