const DummyCommandWithDescription = Jymfony.Component.Messenger.Fixtures.DummyCommandWithDescription;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * Used whenever a test needs to show a message handler with a class description.
 *
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyCommandWithDescriptionHandler {
    __invoke(@Type(DummyCommandWithDescription) command) {
    }
}
