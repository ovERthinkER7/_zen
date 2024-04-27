const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("back")
        .setDescription("Play previous song"),
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

        if (queue) {
            if (
                interaction.guild.members.me.voice.channelId !==
                interaction.member.voice.channelId
            ) {
                return interaction.reply({
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
        }
        if (!queue) {
            const queueError = new EmbedBuilder()
                .setDescription("🚫 | There is Nothing Playing")
                .setColor("Aqua");
            return await interaction.reply({
                embeds: [queueError],
                ephemeral: true,
            });
        }
        if (!queue._prev) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(
                            "🚫 | There is No previous song in the queue"
                        ),
                ],
                ephemeral: true,
            });
        }
        try {
            await client.distube.previous(interaction);
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(`🎵 | **Playing previous song!**`),
                ],
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `🚫 | The previous song in the playlist cannot be played back!`
                        ),
                ],
                ephemeral: true,
            });
        }
    },
};
