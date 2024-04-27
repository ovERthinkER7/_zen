const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave voice channel"),
    run: async ({ interaction, client }) => {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`🚫 | Please join voice channel!`),
                ],
                ephemeral: true,
            });
        }

        if (
            interaction.guild.members.me.voice.channelId !==
            interaction.member.voice.channelId
        ) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `🚫 | You need to be on the same voice channel as the Bot!`
                        ),
                ],
                ephemeral: true,
            });
        }
        try {
            if (queue) {
                await queue.stop();
                client.distube.voices.leave(interaction);

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`👋 | **Leaving voice channel**`)
                            .setFooter({
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: interaction.user.displayAvatarURL({
                                    dynamic: true,
                                }),
                            }),
                    ],
                });
            } else {
                client.distube.voices.leave(interaction);

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Aqua")
                            .setDescription(`👋 | **Leaving voice channel**`)
                            .setFooter({
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: interaction.user.displayAvatarURL({
                                    dynamic: true,
                                }),
                            }),
                    ],
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
