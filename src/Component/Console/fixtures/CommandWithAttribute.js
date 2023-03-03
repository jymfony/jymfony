const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;

export default
@AsCommand({ name: '|foo|f', description: 'desc' })
class CommandWithAttribute extends Command {
}
