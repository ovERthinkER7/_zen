const { SlashCommandBuilder } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autorole-configure")
        .setDescription("Configure your auto-role for this server")
        .addRoleOption((opt) =>
            opt
                .setName("role")
                .setDescription("The role you want users to get on join.")
                .setRequired(true)
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        const targetRoleId = interaction.options.get("role").value;

        try {
            await interaction.deferReply();

            let autoRole = await AutoRole.findOne({
                guildId: interaction.guild.id,
            });

            if (autoRole) {
                if (autoRole.roleId === targetRoleId) {
                    interaction.editReply(
                        "Auto role has already been configured for that role. To disable run `/autorole-disable`"
                    );
                    return;
                }

                autoRole.roleId = targetRoleId;
            } else {
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId,
                });
            }

            await autoRole.save();
            interaction.editReply(
                "Autorole has now been configured. To disable run </autorole-disable:1224757992386199652>"
            );
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        userPermission: ["Administrator"],
        botPermissions: ["ManageRoles"],
    },
};
