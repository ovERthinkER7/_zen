const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a member from this server.")
        .addUserOption((opt) =>
            opt
                .setName("target-user")
                .setDescription("The user you want to unban.")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("reason")
                .setDescription("Reason for unbanning.")
                .setRequired(false)
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const targetUserId = interaction.options.get("target-user").value;
        const reason =
            interaction.options.get("reason")?.value || "No reason provided";

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
                `:white_check_mark: <@${targetUserId}> has been unbanned | ${reason}`
            );

        try {
            // Unban the targetUser
            await interaction.guild.members.unban(targetUserId, reason);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error when unbanning user: ${error}`);
            await interaction.editReply(
                "There was an error while unbanning the user."
            );
        }
    },
    options: {
        userPermissions: ["BanMembers"],
        botPermissions: ["BanMembers"],
    },
};
