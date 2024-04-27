module.exports = async (interaction, client, handler) => {
    if (!interaction.isAutocomplete()) return;
    const commands = handler.commands;
    const command = commands.find(
        (cmd) => cmd.data.name === interaction.commandName
    );
    if (!command) return;
    try {
        command.options.autocomplete(interaction, client);
    } catch (error) {
        console.log(error);
        await interaction.reply({
            content: `An error has occurred!\n\`\`\`${error}\`\`\``,
            ephemeral: true,
        });
    }
};
