const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrelated")
        .setDescription("Add a similar/related song to the current song")
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        if (!voiceChannel) {
            return await interaction.reply({
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
            await interaction.reply({
                content: `Searching Related song for... **${queue.songs[0].name}**`,
                ephemeral: true,
            });
            await queue.addRelatedSong();
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setTitle(`🎶 Added Related Song`)
                        .setDescription(
                            `✅ | Added: **${
                                queue.songs[queue.songs.length - 1].name
                            }**`
                        ),
                ],
            });
        } catch (err) {
            console.log(err);
        }
    },
};
