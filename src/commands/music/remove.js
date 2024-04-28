const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove song!")
        .addNumberOption((option) =>
            option
                .setName("id")
                .setDescription("ID")
                .setRequired(true)
                .setAutocomplete(true)
        )
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
        try {
            const id = interaction.options.getNumber("id");
            console.log(id);
            // let track = queue.songs[args[0]];
            let song = queue.songs.splice(id, 1);
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setTitle(`🎵 Song Removed`)
                        .setDescription(
                            `🎵 | Removed ${song[0].name} from the playlist!`
                        ),
                ],
            });
            setTimeout(async () => {
                await msg.delete();
            }, 60000);
        } catch (err) {
            console.log(err);
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setAuthor({
                            name: "Error",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`🚫 | Error!\n\`\`\`${err}\`\`\``),
                ],
                ephemeral: true,
            });
        }
    },
    options: {
        autocomplete: async (interaction, client) => {
            const focusedValue = interaction.options.getFocused();
            const queue = await client.distube.getQueue(interaction);
            if (!queue) return;
            if (queue.songs.length > 25) {
                const tracks = queue.songs
                    .map((song, i) => {
                        return {
                            name: `${i + 1}. ${song.name}`,
                            value: i + 1,
                        };
                    })
                    .slice(0, 25);
                const filtered = tracks.filter((track) =>
                    track.name.startsWith(focusedValue)
                );
                await interaction.respond(
                    filtered.map((track) => ({
                        name: track.name,
                        value: track.value,
                    }))
                );
            } else {
                const tracks = queue.songs
                    .map((song, i) => {
                        if (i == 0) return;
                        return {
                            name: `${i}. ${song.name}`,
                            value: i,
                        };
                    })
                    .slice(1, queue.songs.length);
                const filtered = tracks.filter((track) =>
                    track.name.startsWith(focusedValue)
                );
                await interaction.respond(
                    filtered.map((track) => ({
                        name: track.name,
                        value: track.value,
                    }))
                );
            }
        },
    },
};
