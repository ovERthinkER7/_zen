const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current song in the queue"),
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

        if (queue.songs.length === 1 && queue.autoplay === false) {
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription("🚨 | **There are no Songs in queue**");

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            try {
                await client.distube.skip(interaction);

                const embed = new EmbedBuilder()
                    .setColor("Aqua")
                    .setDescription("⏭ | **Song has been Skipped**");

                return await interaction.reply({ embeds: [embed] });
            } catch (err) {
                console.log(err);
            }
        }
    },
};
