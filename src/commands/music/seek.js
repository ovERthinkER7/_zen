const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Sets the time of the playback")
        .addStringOption((opt) =>
            opt
                .setName("time")
                .setDescription("Enter in time(1m,30s)")
                .setRequired(true)
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
            const time = interaction.options.getString("time");
            const timearr = time.split(" ");
            let timeinsec = 0;
            timearr.forEach(async (e) => {
                if (isNaN(ms(e))) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(
                                    `🚫 | Please provide valid time in format like (2m 4s,30s)!`
                                ),
                        ],
                        ephemeral: true,
                    });
                }
                timeinsec = timeinsec + ms(e) / 1000;
            });
            if (timeinsec >= queue.songs[0].duration) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                `🚫 | Please provide time less than song duration \`${queue.songs[0].formattedDuration}\`!`
                            ),
                    ],
                    ephemeral: true,
                });
            }
            await queue.seek(timeinsec);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(
                            `Playback set to **${queue.formattedCurrentTime}/ ${queue.songs[0].formattedDuration}**`
                        )
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        }),
                ],
            });
        } catch (err) {
            console.log(err);
        }
    },
};
