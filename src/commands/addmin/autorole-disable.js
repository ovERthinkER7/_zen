const { SlashCommandBuilder } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
    run: async ({ client, interaction }) => {
        try {
            await interaction.deferReply();

            if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
                interaction.editReply(
                    "Auto role has not been configured for this server. Use </autorole-configure:1224740652680614018> to set it up."
                );
                return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
            interaction.editReply(
                "Auto role has been disabled for this server. Use </autorole-configure:1224740652680614018> to set it up again."
            );
        } catch (error) {
            console.log(error);
        }
    },
    data: new SlashCommandBuilder()
        .setName("autorole-disable")
        .setDescription("Disable autorole in this server")
        .setDMPermission(false),
    options: {
        userPermission: ["Administrator"],
    },
};
