const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the current song!")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("Choose the type of loop!")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    run: async ({ interaction, client }) => {
        const loop = interaction.options.getString("type");
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
        console.log(queue.repeatMode);
        if (loop === "Turn off repeat mode") {
            queue.setRepeatMode(0);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(
                            `🔁 | **Song/playlist loop is disabled**!`
                        ),
                ],
            });
        } else if (loop === "Repeat the song") {
            queue.setRepeatMode(1);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")

                        .setDescription(`🔁 | **Song loop is enabled**!`),
                ],
            });
        } else if (loop === "Repeat song list") {
            queue.setRepeatMode(2);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")

                        .setDescription(`🔁 | **Playlist loop is enabled!**`),
                ],
            });
        }
    },
    options: {
        autocomplete: async (interaction, client) => {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                "Turn off repeat mode",
                "Repeat the song",
                "Repeat song list",
            ];
            const filtered = choices.filter((choice) =>
                choice.startsWith(focusedValue)
            );
            await interaction.respond(
                filtered.map((choice) => ({ name: choice, value: choice }))
            );
        },
    },
};
