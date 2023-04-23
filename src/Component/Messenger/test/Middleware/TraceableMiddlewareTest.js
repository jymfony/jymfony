const Argument = Jymfony.Component.Testing.Argument.Argument;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const MiddlewareTestCase = Jymfony.Component.Messenger.Test.MiddlewareTestCase;
const StackMiddleware = Jymfony.Component.Messenger.Middleware.StackMiddleware;
const TraceableMiddleware = Jymfony.Component.Messenger.Middleware.TraceableMiddleware;
const Stopwatch = Jymfony.Component.Stopwatch.Stopwatch;
const StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;
const StopwatchEventInterface = Jymfony.Contracts.Stopwatch.StopwatchEventInterface;

export default class TraceableMiddlewareTest extends MiddlewareTestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testHandle() {
        const busId = 'command_bus';
        const envelope = new Envelope(new DummyMessage('Hello'));

        const middleware = this.prophesize(MiddlewareInterface);
        middleware.handle(Argument.cetera()).shouldBeCalledTimes(1).will((envelope, stack) => stack.next().handle(envelope, stack));

        const stopwatch = this.prophesize(StopwatchInterface);
        stopwatch.isStarted(Argument.type('string')).shouldBeCalledTimes(2).willReturn(true);

        stopwatch.start(Argument.that(name => name.includes('" on "command_bus"')), 'messenger.middleware')
            .shouldBeCalledTimes(1)
            .will(() => this.prophesize(StopwatchEventInterface));
        stopwatch.start('Tail on "command_bus"', 'messenger.middleware')
            .shouldBeCalledTimes(1)
            .will(() => this.prophesize(StopwatchEventInterface));

        stopwatch.stop(Argument.that(name => name.includes('" on "command_bus"')))
            .shouldBeCalledTimes(1)
            .will(() => this.prophesize(StopwatchEventInterface));
        stopwatch.stop('Tail on "command_bus"')
            .shouldBeCalledTimes(1)
            .will(() => this.prophesize(StopwatchEventInterface));

        const traced = new TraceableMiddleware(stopwatch.reveal(), busId);
        await traced.handle(envelope, new StackMiddleware([ middleware.reveal() ]));
    }

    async testHandleWithException() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Thrown from next middleware.');
        const busId = 'command_bus';

        const middleware = this.prophesize(MiddlewareInterface);
        middleware.handle(Argument.cetera()).willThrow(new RuntimeException('Thrown from next middleware.'));

        const stopwatch = this.prophesize(StopwatchInterface);
        stopwatch.isStarted(Argument.that(name => name.includes('" on "command_bus"'))).willReturn(true);
        // Start/stop are expected to be called once, as an exception is thrown by the next callable
        stopwatch
            .start(Argument.that(name => name.includes('" on "command_bus"')), 'messenger.middleware')
            .shouldBeCalledTimes(1);
        stopwatch
            .stop(Argument.that(name => name.includes('" on "command_bus"')))
            .shouldBeCalledTimes(1);

        const traced = new TraceableMiddleware(stopwatch.reveal(), busId);
        await traced.handle(new Envelope(new DummyMessage('Hello')), new StackMiddleware([ middleware ]));
    }

    async testHandleWhenStopwatchHasBeenReset() {
        const busId = 'command_bus';
        const envelope = new Envelope(new DummyMessage('Hello'));

        const stopwatch = new Stopwatch();

        const middleware = this.prophesize(MiddlewareInterface);
        middleware.handle(Argument.cetera())
            .shouldBeCalledTimes(1)
            .will((envelope, stack) => {
                stopwatch.reset();
                return stack.next().handle(envelope, stack);
            });

        const traced = new TraceableMiddleware(stopwatch, busId);
        await traced.handle(envelope, new StackMiddleware([ middleware.reveal() ]));
    }
}
