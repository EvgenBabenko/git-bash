class CommandRegistry {
    commands = {};
    register(command) {
        this.commands[command.name] = command;
    }
    get(commandName) {
        return this.commands[commandName];
    }
    getAll() {
        return Object.values(this.commands);
    }
}
export { CommandRegistry };
