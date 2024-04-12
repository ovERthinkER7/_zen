const {
    SlashCommandBuilder,
    EmbedBuilder,
    Routes,
    DataResolver,
} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot-banner")
        .setDescription("Add banner to your bot.")
        .addAttachmentOption((opt) =>
            opt
                .setName("banner")
                .setDescription("The banner to add.")
                .setRequired(true)
        ),
    run: async ({ client, interaction }) => {
        const { options } = interaction;
        const banner = options.getAttachment("banner");
        await interaction.deferReply({ ephemeral: true });
        async function sendMessage(msg) {
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(msg);

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
        if (
            banner.contentType !== "image/gif" &&
            banner.contentType !== "image/png"
        )
            return await sendMessage(
                `⚠️ Please use gif or png format for banner`
            );
        var error;
        await client.rest
            .patch(Routes.user(), {
                body: { banner: await DataResolver.resolveImage(banner.url) },
            })
            .catch(async (err) => {
                error = true;
                console.log(err);
                return await sendMessage(`⚠️ Error : \`${err.toString()}\``);
            });

        if (error) return;
        await sendMessage(`✅ Successfully set banner for your bot.`);
    },

    options: {
        devOnly: true,
    },
};
