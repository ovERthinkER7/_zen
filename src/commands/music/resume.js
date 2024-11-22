const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the paused song!")
        .setDMPermission(false),
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
        if (!queue.paused) {
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(`🚫 | The music is already playing!`);
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
        try {
            await client.distube.resume(interaction);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(`▶️ **Music resumed!**`),
                ],
            });
        } catch (err) {
            console.log(err);
        }
    },
};
