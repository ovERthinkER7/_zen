const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            await interaction.reply({
                content: `Error running this command`,
                ephemeral: true,
            });
            console.log(err);
        }
    },
};
