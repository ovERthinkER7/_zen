const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { paginationEmbed } = require("../../utils/pagination.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("See the list of songs in the queue!")
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
        if (!queue) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`🚫 | There is nothing in the queue`),
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
            let btn1 = new ButtonBuilder()
                .setCustomId("previousbtn")
                .setLabel("Previous")
                .setStyle(ButtonStyle.Secondary);

            const btn2 = new ButtonBuilder()
                .setCustomId("nextbtn")
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary);

            let currentEmbedItems = [];
            let embedItemArray = [];
            let pages = [];

            let buttonList = [btn1, btn2];

            if (queue.songs.length > 11) {
                queue.songs.forEach((s, i) => {
                    s.index = i;
                    if (s.name !== queue.songs[0].name) {
                        if (currentEmbedItems.length < 10)
                            currentEmbedItems.push(s);
                        else {
                            embedItemArray.push(currentEmbedItems);
                            currentEmbedItems = [s];
                        }
                    }
                });
                embedItemArray.push(currentEmbedItems);

                embedItemArray.forEach((x) => {
                    let songs = x
                        .map(
                            (s) =>
                                `${s.index}. [${s.name}](${s.url}) - \`${s.formattedDuration}\``
                        )
                        .join("\n");
                    let emb = new EmbedBuilder()
                        .setTitle("Songs list")
                        .setColor("Aqua")
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setDescription(
                            `**Now playing**\n[**${queue.songs[0].name}**](${queue.songs[0].url})\n\n${songs}`
                        );
                    pages.push(emb);
                });

                await paginationEmbed(interaction, pages, buttonList);
            } else {
                let songs = queue.songs
                    .map((s, i) => {
                        if (s.name !== queue.songs[0].name) {
                            return `${i}. [${s.name}](${s.url}) - \`${s.formattedDuration}\``;
                        }
                    })
                    .join("\n");

                let emb = new EmbedBuilder()
                    .setTitle("Songs list")
                    .setColor("Aqua")
                    .setThumbnail(queue.songs[0].thumbnail)
                    .setDescription(
                        `**Now playing**\n[**${queue.songs[0].name}**](${queue.songs[0].url})\n\n${songs}`
                    )
                    .setFooter({ text: "Page 1 / 1" });
                return interaction.reply({ embeds: [emb] });
            }
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
};
