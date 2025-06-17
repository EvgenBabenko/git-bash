const promt = {
    name: "promt",
    description: "Prompt user for their name and greet them.",
    async run ({ emit, cli }) {
        const name = await cli.promptUser("What's your name?");
        emit(`Hello, ${name}!`);
    }
};
export { promt };
