const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription(
                    "The song you want to play | supported url: yt,soundcloud,spotify"
                )
                .setRequired(true)
        ),
    run: async ({ interaction, client }) => {
        await interaction.deferReply();
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        const query = interaction.options.get("query").value;
        if (!voiceChannel) {
            return interaction.editReply({
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
                return interaction.editReply({
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
            const options = {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction,
            };
            await client.distube.play(voiceChannel, query, options);
            const song = require("../../utils/distube.js");
            var issongs = song.queues.songs.length == 1 ? "song" : "songs";
            var isplaylist = song.isplaylist ? "**Playlist:**" : "**Song:**";
            const embed = new EmbedBuilder()
                .setTitle("🎵 Added to queue")
                .setDescription(`${isplaylist} [${song.name}](${song.url})`)
                .addFields(
                    {
                        name: `Requested by`,
                        value: `${song.user}`,
                        inline: true,
                    },
                    {
                        name: `Duration`,
                        value: `\`${song.formattedDuration}\``,
                        inline: true,
                    },
                    {
                        name: `Queue`,
                        value: `${song.queues.songs.length} ${issongs} - \`${song.queues.formattedDuration}\``,
                        inline: true,
                    }
                )
                .setThumbnail(song.thumbnail)
                .setColor("Aqua")
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            // await interaction.editReply("⚠️ Not found");
        }
    },
    options: {
        botPermission: ["CONNECT", "SPEAK"],
    },
};
