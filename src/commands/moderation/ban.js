const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from this server.")
        .addUserOption((opt) =>
            opt
                .setName("target-user")
                .setDescription("The user you want to Ban.")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("reason")
                .setDescription("The reason you want to Ban.")
                .setRequired(false)
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const targetUserId = interaction.options.get("target-user").value;
        const reason =
            interaction.options.get("reason")?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply(
                "That user doesn't exist in this server."
            );
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(
                "You can't ban that user because they're the server owner."
            );
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition =
            interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition =
            interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply({
                content:
                    "You can't ban that user because they have the same/higher role than you.",
                ephemeral: true,
            });
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply(
                "I can't ban that user because they have the same/higher role than me."
            );
            return;
        }

        const dmembed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
                `:white_check_mark: You have been banned from ${interaction.guild.name} | ${reason}`
            );
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
                `:white_check_mark: ${targetUser} has been banned | ${reason}`
            );

        // Ban the targetUser
        try {
            await targetUser.ban({ reason });
        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
        await targetUser.send({ embeds: [dmembed] }).catch((err) => {
            console.log(err);
            return;
        });
        await interaction.editReply({ embeds: [embed] });
    },
    options: {
        userPermissions: ["BanMembers"],
        botPermissions: ["BanMembers"],
    },
};
