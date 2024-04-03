const { ButtonKit } = require("commandkit");
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
function getButtons() {
    const del = new ButtonKit()
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("delete");

    const row = new ActionRowBuilder().addComponents(del);

    return { del, row };
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Displays the avatar of user.")
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("The user whose avatar to display.")
                .setRequired(false)
        ),
    run: async ({ interaction, client, handler }) => {
        const { del, row } = getButtons();
        const user = interaction.options.getUser("user") || interaction.user;
        const avatarurl = user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 1024,
        });
        // console.log(user);

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s avatar`)
            .setImage(avatarurl)
            .setColor("Random");
        try {
            const message = await interaction.reply({
                embeds: [embed],
                components: [row],
            });
            const collectorFilter = (i) => i.user.id === interaction.user.id;

            const confirmation = await message.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });
            if (confirmation.customId === "delete") {
                interaction.deleteReply();
            }
        } catch (err) {
            await interaction.editReply({
                content: `Error running this command`,
                ephemeral: true,
            });
            console.log(err);
        }
    },
};
