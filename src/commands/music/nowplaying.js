const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { progressBar } = require("../../utils/progressbar.js");

const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Loop: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? "All Queue"
                : "This Song"
            : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
    }\``;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Show the currently playing now!"),
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

        if (!queue) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`🚫 | currently no song is playing`),
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

        try {
            const song = queue.songs[0];
            var bar = progressBar(song.duration, queue.currentTime, 10);
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setTitle("🎵 Playing")
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.name}](${song.url})`)
                .addFields(
                    {
                        name: `\n`,
                        value: `${bar}  \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\`\n\n`,
                        inline: false,
                    },

                    {
                        name: `**Status**`,
                        value: status(queue).toString(),
                        inline: false,
                    }
                )
                .setFooter({
                    text: `Requested by ${song.user.username}`,
                    iconURL: song.user.avatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`🚫 | Something went wrong...`),
                ],
                ephemeral: true,
            });
        }
    },
    options: {
        botPermission: ["CONNECT", "SPEAK"],
    },
};
