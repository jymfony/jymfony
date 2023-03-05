const Argument = Jymfony.Component.Testing.Argument.Argument;
const CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
const CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
const CommandTester = Jymfony.Component.Console.Tester.CommandTester;
const StopWorkersCommand = Jymfony.Component.Messenger.Command.StopWorkersCommand;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StopWorkersCommandTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testItSetsCacheItem() {
        const cachePool = this.prophesize(CacheItemPoolInterface);
        const cacheItem = this.prophesize(CacheItemInterface);

        cacheItem.set(Argument.any()).shouldBeCalledTimes(1);
        cachePool.getItem(Argument.any()).shouldBeCalledTimes(1).willReturn(cacheItem);
        cachePool.save(cacheItem).shouldBeCalledTimes(1).willReturn();

        const command = new StopWorkersCommand(cachePool.reveal());

        const tester = new CommandTester(command);
        await tester.run({});
    }
}
