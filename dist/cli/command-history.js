class CommandHistory {
    commands = [];
    index = -1;
    add(command) {
        this.commands.push(command);
        this.index = this.commands.length;
    }
    prev() {
        if (this.index > 0) this.index--;
        return this.commands[this.index] || "";
    }
    next() {
        if (this.index < this.commands.length - 1) {
            this.index++;
            return this.commands[this.index] || "";
        }
        this.index = this.commands.length;
        return "";
    }
    reset() {
        this.index = this.commands.length;
    }
}
export { CommandHistory };
