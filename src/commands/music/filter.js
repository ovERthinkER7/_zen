const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("filter")
        .setDescription("Filter the queue")
        .addStringOption((option) =>
            option
                .setName("filter")
                .setDescription("Filter the queue")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const filter = interaction.options.getString("filter");
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
            if (filter === "off" && queue.filters.size) queue.filters.clear();
            else if (Object.keys(client.distube.filters).includes(filter)) {
                if (queue.filters.has(filter)) queue.filters.remove(filter);
                else queue.filters.add(filter);
            }
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(
                            `Filter \`${filter}\` have been added to the audio!`
                        ),
                ],
            });
        } catch (e) {
            console.log(e);
        }
    },
    options: {
        autocomplete: async (interaction, client) => {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                "off",
                "3d",
                "bassboost",
                "echo",
                "karaoke",
                "nightcore",
                "surround",
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
