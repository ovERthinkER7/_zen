const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change the volume of song!")
        .addIntegerOption((opt) =>
            opt
                .setName("volume")
                .setDescription("Enter volume value between 0-200")
                .setRequired(true)
                .setMaxValue(200)
                .setMinValue(0)
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const vol = interaction.options.get("volume").value;
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
        const volume = parseInt(vol);
        if (volume < 0 || volume > 200) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(
                            `🚫 | The volume value must be from 0 to 200!`
                        ),
                ],
                ephemeral: true,
            });
        }
        queue.setVolume(volume);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Aqua")
                    .setDescription(
                        `🔊 | **The volume has been changed to: ${volume}%**`
                    ),
            ],
        });
    },
};
