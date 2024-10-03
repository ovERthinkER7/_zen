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
        )
        .setDMPermission(false),
    run: async ({ interaction, client }) => {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        const query = interaction.options.get("query").value;
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

        await interaction.deferReply({ ephemeral: true });

        const searchEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription("Searching...")
            .setFooter({
                text: `Requested by ${
                    interaction.user.globalName || interaction.user.username
                }`,
                iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
            });

        await interaction.editReply({ embeds: [searchEmbed] });

        try {
            await client.distube.play(voiceChannel, query, {
                member: interaction.member,
                textChannel: interaction.channel,
            });

            await interaction.deleteReply();
        } catch (error) {
            console.log(error);
            // await interaction.editReply("⚠️ Not found");
        }
    },
    options: {
        botPermission: ["CONNECT", "SPEAK"],
    },
};
