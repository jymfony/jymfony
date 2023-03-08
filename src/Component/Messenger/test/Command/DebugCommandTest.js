const Application = Jymfony.Component.Console.Application;
const CommandTester = Jymfony.Component.Console.Tester.CommandTester;
const CommandCompletionTester = Jymfony.Component.Console.Tester.CommandCompletionTester;
const DebugCommand = Jymfony.Component.Messenger.Command.DebugCommand;
const DummyCommand = Jymfony.Component.Messenger.Fixtures.DummyCommand;
const DummyCommandHandler = Jymfony.Component.Messenger.Fixtures.DummyCommandHandler;
const DummyCommandWithDescription = Jymfony.Component.Messenger.Fixtures.DummyCommandWithDescription;
const DummyCommandWithDescriptionHandler = Jymfony.Component.Messenger.Fixtures.DummyCommandWithDescriptionHandler;
const DummyQuery = Jymfony.Component.Messenger.Fixtures.DummyQuery;
const DummyQueryHandler = Jymfony.Component.Messenger.Fixtures.DummyQueryHandler;
const MultipleBusesMessage = Jymfony.Component.Messenger.Fixtures.MultipleBusesMessage;
const MultipleBusesMessageHandler = Jymfony.Component.Messenger.Fixtures.MultipleBusesMessageHandler;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class DebugCommandTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    __construct() {
        super.__construct();

        this._colSize = undefined;
    }

    beforeEach() {
        this._colSize = process.env.COLUMNS;
        process.env.COLUMNS = '120';
    }

    afterEach() {
        if (this._colSize === undefined) {
            delete process.env.COLUMNS;
        } else {
            process.env.COLUMNS = this._colSize;
        }
    }

    async testOutput() {
        const command = new DebugCommand({
            'command_bus': {
                [ReflectionClass.getClassName(DummyCommand)]: [ [ ReflectionClass.getClassName(DummyCommandHandler), {
                    option1: '1',
                    option2: '2',
                } ] ],
                [ReflectionClass.getClassName(DummyCommandWithDescription)]: [ [ ReflectionClass.getClassName(DummyCommandWithDescriptionHandler), {} ] ],
                [ReflectionClass.getClassName(MultipleBusesMessage)]: [ [ ReflectionClass.getClassName(MultipleBusesMessageHandler), {} ] ],
            },
            'query_bus': {
                [ReflectionClass.getClassName(DummyQuery)]: [ [ ReflectionClass.getClassName(DummyQueryHandler), {} ] ],
                [ReflectionClass.getClassName(MultipleBusesMessage)]: [ [ ReflectionClass.getClassName(MultipleBusesMessageHandler), {} ] ],
            },
        });

        const tester = new CommandTester(command);

        await tester.run({}, { decorated: false });
        __self.assertSame(`
Messenger
=========

command_bus
-----------

 The following messages can be dispatched:

 ----------------------------------------------------------------------------------------------------- 
  Jymfony.Component.Messenger.Fixtures.DummyCommand                                                    
      handled by Jymfony.Component.Messenger.Fixtures.DummyCommandHandler (when option1=1, option2=2)  
                                                                                                       
  Used whenever a test needs to show a message with a class description.                               
  Jymfony.Component.Messenger.Fixtures.DummyCommandWithDescription                                     
      handled by Jymfony.Component.Messenger.Fixtures.DummyCommandWithDescriptionHandler               
                 Used whenever a test needs to show a message handler with a class description.        
                                                                                                       
  Jymfony.Component.Messenger.Fixtures.MultipleBusesMessage                                            
      handled by Jymfony.Component.Messenger.Fixtures.MultipleBusesMessageHandler                      
                                                                                                       
 ----------------------------------------------------------------------------------------------------- 

query_bus
---------

 The following messages can be dispatched:

 --------------------------------------------------------------------------------- 
  Jymfony.Component.Messenger.Fixtures.DummyQuery                                  
      handled by Jymfony.Component.Messenger.Fixtures.DummyQueryHandler            
                                                                                   
  Jymfony.Component.Messenger.Fixtures.MultipleBusesMessage                        
      handled by Jymfony.Component.Messenger.Fixtures.MultipleBusesMessageHandler  
                                                                                   
 --------------------------------------------------------------------------------- 

`, tester.getDisplay(true));

        await tester.run({ bus: 'query_bus' }, { decorated: false });
        __self.assertSame(`
Messenger
=========

query_bus
---------

 The following messages can be dispatched:

 --------------------------------------------------------------------------------- 
  Jymfony.Component.Messenger.Fixtures.DummyQuery                                  
      handled by Jymfony.Component.Messenger.Fixtures.DummyQueryHandler            
                                                                                   
  Jymfony.Component.Messenger.Fixtures.MultipleBusesMessage                        
      handled by Jymfony.Component.Messenger.Fixtures.MultipleBusesMessageHandler  
                                                                                   
 --------------------------------------------------------------------------------- 

`, tester.getDisplay(true));
    }

    async testOutputWithoutMessages() {
        const command = new DebugCommand({ command_bus: {}, query_bus: {} });

        const tester = new CommandTester(command);
        await tester.run({}, { decorated: false });

        __self.assertSame(`
Messenger
=========

command_bus
-----------

 [WARNING] No handled message found in bus "command_bus".                                                              

query_bus
---------

 [WARNING] No handled message found in bus "query_bus".                                                                

`, tester.getDisplay(true));
    }

    async testExceptionOnUnknownBusArgument() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Bus "unknown_bus" does not exist. Known buses are "command_bus", "query_bus".');
        const command = new DebugCommand({ command_bus: {}, query_bus: {} });

        const tester = new CommandTester(command);
        await tester.run({ bus: 'unknown_bus' }, { decorated: false });
    }

    @dataProvider('provideCompletionSuggestions')
    async testComplete(input, expectedSuggestions) {
        const command = new DebugCommand({ command_bus: {}, query_bus: {} });
        const application = new Application();
        application.add(command);
        const tester = new CommandCompletionTester(application.get('debug:messenger'));
        __self.assertSame(expectedSuggestions, await tester.complete(input));
    }

    * provideCompletionSuggestions() {
        yield [
            [ '' ],
            [ 'command_bus', 'query_bus' ],
        ];
    }
}
