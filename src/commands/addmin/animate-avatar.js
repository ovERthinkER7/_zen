const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("animate-avatar")
        .setDescription("Set animate avatar for your bot.")
        .addAttachmentOption((opt) =>
            opt
                .setName("avatar")
                .setDescription("The avatar to set")
                .setRequired(true)
        ),
    run: async ({ client, interaction }) => {
        const { options } = interaction;
        const avatar = options.getAttachment("avatar");
        await interaction.deferReply({ ephemeral: true });
        async function sendMessage(msg) {
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(msg);

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
        if (avatar.contentType !== "image/gif")
            return await sendMessage(
                `⚠️ Please use gif format for animated avatar`
            );
        var error;
        await client.user.setAvatar(avatar.url).catch(async (err) => {
            error = true;
            console.log(err);
            return await sendMessage(`⚠️ Error : \`${err.toString()}\``);
        });

        if (error) return;
        await sendMessage(`✅ Successfully set animated avatar for your bot.`);
    },

    options: {
        devOnly: true,
    },
};
