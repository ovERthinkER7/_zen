const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription("Enable or disable autoplay"),
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
        try {
            const mode = client.distube.toggleAutoplay(interaction);
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(`Autoplay mode is now ${mode ? "On" : "Off"}`);
            return await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
        }
    },
};
