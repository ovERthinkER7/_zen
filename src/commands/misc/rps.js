const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    SlashCommandBuilder,
} = require("discord.js");

const choices = [
    { name: "Rock", emoji: "🪨", beats: "Scissors" },
    { name: "Paper", emoji: "📃", beats: "Rock" },
    { name: "Scissors", emoji: "✂", beats: "Paper" },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Play rock paper scissor with another user")
        .setDMPermission(false)
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("The user you want to play with")
                .setRequired(true)
        )
        .setDMPermission(false),

    run: async ({ client, interaction }) => {
        try {
            const targetUser = interaction.options.getUser("user");
            if (interaction.user.id === targetUser.id) {
                interaction.reply({
                    content:
                        "You cannot play rock play scissors with yourself.",
                    ephemeral: true,
                });
                return;
            }
            if (targetUser.bot) {
                interaction.reply({
                    content: "You cannot play rock play scissors with bot.",
                    ephemeral: true,
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle("Rock Paper Scissor")
                .setDescription(`it's currently ${targetUser}'s turn`)
                .setColor("Blue")
                .setTimestamp(new Date());

            const button = choices.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji);
            });

            const row = new ActionRowBuilder().addComponents(button);

            const reply = await interaction.reply({
                content: `${targetUser} you have been challenged to game of rock paper scissors, by ${interaction.user}. To start playing, click one of the button below`,
                embeds: [embed],
                components: [row],
            });
            const targetUserInteraction = await reply
                .awaitMessageComponent({
                    filter: (i) => i.user.id === targetUser.id,
                    time: 50_000,
                })
                .catch(async (error) => {
                    embed.setDescription(
                        `Game over. ${targetUser} does not respond in time.`
                    );
                    await interaction.editReply({
                        embeds: [embed],
                        components: [],
                    });
                });
            if (!targetUserInteraction) return;

            const targetUserChoice = choices.find(
                (choice) => choice.name === targetUserInteraction.customId
            );

            await targetUserInteraction.reply({
                content: `You picked ${
                    targetUserChoice.name + targetUserChoice.emoji
                }`,
                ephemeral: true,
            });

            embed.setDescription(`It's currently ${interaction.user}'s turn.`);
            await interaction.editReply({
                content: `${interaction.user} it's your turn now.`,
                embeds: [embed],
            });

            const initialUserInteraction = await reply
                .awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 50_000,
                })
                .catch(async (error) => {
                    embed.setDescription(
                        `Game over. ${interaction.user} does not respond in time.`
                    );
                    await interaction.editReply({
                        embeds: [embed],
                        components: [],
                    });
                });
            if (!initialUserInteraction) return;

            const initialUserChoice = choices.find(
                (choice) => choice.name === initialUserInteraction.customId
            );
            let result;
            if (targetUserChoice.beats === initialUserChoice.name) {
                result = `${targetUser} won!`;
            }
            if (initialUserChoice.beats === targetUserChoice.name) {
                result = `${interaction.user} won!`;
            }
            if (initialUserChoice.name === targetUserChoice.name) {
                result = "It was a tie!";
            }
            embed.setDescription(
                `${targetUser} picked ${
                    targetUserChoice.name + targetUserChoice.emoji
                }\n
                ${interaction.user} picked ${
                    initialUserChoice.name + initialUserChoice.emoji
                }
                \n\n${result}`
            );
            interaction.editReply({ embeds: [embed], components: [] });
        } catch (error) {
            console.log("error with /rps");
            console.log(error);
        }
    },
};
