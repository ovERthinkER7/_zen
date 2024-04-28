const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Genius = require("genius-lyrics");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Display the lyrics of currently playing song")
        .addStringOption((opt) =>
            opt
                .setName("song")
                .setDescription("Enter song name to get lyrics")
                .setRequired(false)
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        const songName = interaction.options.getString("song");
        if (!songName) {
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
        }
        await interaction.deferReply();
        try {
            let currentTitle = ``;
            const phrasesToRemove = [
                "Full Video",
                "Full",
                "TV",
                "Size",
                "Opening",
                "ending",
                "OP",
                "ED",
                "Full Audio",
                "Official Music Video",
                "Lyrics",
                "Lyrical Video",
                "Feat.",
                "Ft.",
                "Official",
                "Audio",
                "Video",
                "HD",
                "4K",
                "Remix",
                "Lyric Video",
                "Lyrics Video",
                "8K",
                "High Quality",
                "Animation Video",
                "\\(Official Video\\. .*\\)",
                "\\(Music Video\\. .*\\)",
                "\\[NCS Release\\]",
                "Extended",
                "DJ Edit",
                "with Lyrics",
                "Lyrics",
                "Karaoke",
                "Instrumental",
                "Live",
                "Acoustic",
                "Cover",
                "\\(feat\\. .*\\)",
                "』",
                "『",
            ];

            if (!songName) {
                currentTitle = queue.songs[0].name;
                currentTitle = currentTitle
                    .replace(new RegExp(phrasesToRemove.join("|"), "gi"), "")
                    .replace(/\s*([\[\(].*?[\]\)])?\s*(\|.*)?\s*(\*.*)?$/, "")
                    .replace(/"/g, "");
            }
            let query = songName ? songName : currentTitle;
            console.log(query);
            const cl = new Genius.Client();
            const search = await cl.songs.search(query);
            if (search.length == 0) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("🚫 Lyrics not found")
                            .setDescription(`Try /lyrics song:\`songname\``),
                    ],
                    ephemeral: true,
                });
            }
            const song = search[0];
            const lyrics = await song.lyrics();
            //     try {
            //         lyrics = await lyricsfinder(song, "");
            //         console.log(lyrics);
            //         if (!lyrics) {
            //             return await interaction.editReply({
            //                 embeds: [
            //                     new EmbedBuilder()
            //                         .setColor("Red")
            //                         .setDescription(
            //                             `🚫 | I couldn't find any lyrics for currently playing song!`
            //                         ),
            //                 ],
            //                 ephemeral: true,
            //             });
            //         }
            //     } catch (err) {
            //         console.log(err);
            //     }
            if (lyrics.length > 4000) {
                const channel = interaction.guild.channels.cache.get(
                    interaction.channelId
                );
                const lyrics1 = lyrics.slice(0, 4000);
                const lyricsrest = lyrics.slice(4000);
                let lyricsEmbed = new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle(`🎶 Lyrics`)
                    .setDescription(
                        `## [${song.title}](${song.url})\n\n>>> ${lyrics1}`
                    );
                let lyricsEmbedrest = new EmbedBuilder()
                    .setColor("Aqua")
                    .setDescription(`>>> ${lyricsrest}`)
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    })
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [lyricsEmbed],
                });
                await channel.send({
                    embeds: [lyricsEmbedrest],
                });
            } else {
                let lyricsEmbed = new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle(`🎶 Lyrics`)
                    .setDescription(
                        `## [${song.title}](${song.url})\n\n>>> ${lyrics}`
                    )
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    })
                    .setTimestamp();
                return await interaction.editReply({
                    embeds: [lyricsEmbed],
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
