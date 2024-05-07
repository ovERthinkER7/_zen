const { SlashCommandBuilder, WebhookClient, Client } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("prank")
        .setDescription("Prank someone")
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("The user you want to disguise yourself.")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("message")
                .setDescription("What you want to say")
                .setRequired(true)
        )
        .setDMPermission(false),
    run: async ({ client, interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }
        const targetUser = interaction.options.get("user").value;
        const msg = interaction.options.get("message").value;
        const user = await interaction.guild.members.fetch(targetUser);
        await interaction.reply({
            content: `Executing command ...`,
            ephemeral: true,
        });
        const channel = interaction.channel;
        const channelid = interaction.channelId;
        var flag = 1;
        const imember = interaction.member.id;
        if (imember == "982991731261849600") {
            await interaction.editReply({
                content: "**nigga** cannot run this command | **skill issue**",
            });
            return;
        }
        if (imember == "1057325689335971881") {
            await interaction.editReply({
                content:
                    "**chutiya/lesbian** cannot run this command | **skill issue**",
            });
            return;
        }
        const editwebhook = await interaction.guild.fetchWebhooks();
        // console.log(editwebhook);
        await Promise.all(
            editwebhook.map(async (webhooks) => {
                if (
                    webhooks.name == user.displayName &&
                    webhooks.channelId == channelid &&
                    webhooks.owner.id == client.user.id
                ) {
                    flag = 0;
                    try {
                        await webhooks.send({
                            content: msg,
                            allowedMentions: { parse: ["users"] },
                        });
                        await interaction.editReply({
                            content: "command completed",
                            ephemeral: true,
                        });
                    } catch (err) {
                        return console.log(err);
                    }
                    return;
                }
            })
        );
        if (flag == 1) {
            const webhook = await channel
                .createWebhook({
                    name: user.displayName,
                    avatar: user.user.displayAvatarURL(),
                    channel: channelid,
                })
                .catch((err) => {
                    return interaction.editReply({
                        content: `something went wrong`,
                    });
                });

            try {
                await webhook.send({
                    content: msg,
                    allowedMentions: { parse: ["users"] },
                });
                await interaction.editReply({
                    content: "command completed",
                    ephemeral: true,
                });
            } catch (err) {
                return console.log(err);
            }
        }
    },

    options: {
        botPermission: ["ManageWebhooks"],
    },
};
