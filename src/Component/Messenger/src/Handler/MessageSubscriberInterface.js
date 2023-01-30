const MessageHandlerInterface = Jymfony.Component.Messenger.Handler.MessageHandlerInterface;

/**
 * Handlers can implement this interface to handle multiple messages.
 *
 * @memberOf Jymfony.Component.Messenger.Handler
 */
class MessageSubscriberInterface extends MessageHandlerInterface.definition {
    /**
     * Returns a list of messages to be handled.
     *
     * It returns a list of messages like in the following example:
     *
     *     yield MyMessage;
     *
     * It can also change the priority per classes.
     *
     *     yield [ FirstMessage, {priority: 0} ];
     *     yield [ SecondMessage, {priority: -10} ];
     *
     * It can also specify a method, a priority, a bus and/or transport per message:
     *
     *     yield [ FirstMessage, {method: 'firstMessageMethod'} ];
     *     yield [ SecondMessage, {
     *         method: 'secondMessageMethod',
     *         priority: 20,
     *         bus: 'my_bus_name',
     *         from_transport: 'your_transport_name',
     *     } ];
     *
     * The benefit of using `yield` instead of returning an array is that you can `yield` multiple times the
     * same key and therefore subscribe to the same message multiple times with different options.
     *
     * The `__invoke` method of the handler will be called as usual with the message to handle.
     */
    static getHandledMessages() { }
}
