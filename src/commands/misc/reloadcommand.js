const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reloadcommand")
        .setDescription("Reload all the command")
        .setDMPermission(false),
    run: async ({ interaction, client, handler }) => {
        await interaction.deferReply();

        await handler.reloadCommands();

        interaction.editReply(`Reloaded all the commands`);
        // interaction.reply()
    },
    options: {
        userPermissions: ["Administrator"],
    },
};
