export class CommandHistory {
  private commands: string[] = [];
  private index: number = -1;

  add(command: string) {
    this.commands.push(command);
    this.index = this.commands.length;
    console.log(command, this.commands, this.index);
  }

  prev(): string {
    if (this.index > 0) {
      this.index--;
    }

    return this.commands[this.index] || "";
  }

  next(): string {
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
