const { createCanvas } = require("canvas");
const { ButtonKit } = require("commandkit");
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    AttachmentBuilder,
    ComponentType,
} = require("discord.js");
function getButtons() {
    const avatar = new ButtonKit()
        .setLabel("Avatar")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("avatar")
        .setDisabled(true);

    const bannerbtn = new ButtonKit()
        .setLabel("Banner")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("banner");

    const del = new ButtonKit()
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("delete");

    const row = new ActionRowBuilder().addComponents(avatar, bannerbtn, del);

    return { avatar, bannerbtn, del, row };
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
        await interaction.deferReply();

        const { avatar, bannerbtn, del, row } = getButtons();
        const user =
            (await interaction.options.getUser("user")?.fetch(true)) ||
            (await interaction.user.fetch(true));
        const avatarurl = user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 1024,
        });
        const canvas = createCanvas(400, 100);
        const ctx = canvas.getContext("2d");
        var banner;
        var isbanner;
        if (!user.banner) {
            ctx.fillStyle = user.hexAccentColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            banner = new AttachmentBuilder(canvas.toBuffer("image/png"), {
                name: "image.png",
            });
            isbanner = false;
        } else {
            banner = user.bannerURL({
                size: 512,
                dynamic: true,
                format: "png",
            });
            isbanner = true;
        }
        const color = user?.hexAccentColor || "Aqua";
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s avatar`)
            .setImage(avatarurl)
            .setColor(color);
        try {
            const message = await interaction.editReply({
                embeds: [embed],
                components: [row],
            });
            const collectorFilter = (i) => i.user.id === interaction.user.id;

            const confirmation = await message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: collectorFilter,
                time: 60_000,
            });
            var banneron = false;
            confirmation.on("collect", async (i) => {
                await i.deferUpdate();
                var avataron = true;
                if (i.customId === "delete") {
                    await message.delete();
                } else if (i.customId === "banner") {
                    banneron = true;
                    avataron = false;
                    if (isbanner) {
                        embed
                            .setImage(banner)
                            .setTitle(`${user.username}'s banner`);
                    } else {
                        embed
                            .setImage("attachment://image.png")
                            .setTitle(`${user.username}'s banner`);
                    }
                } else if (i.customId === "avatar") {
                    banneron = false;
                    avataron = true;
                    embed
                        .setTitle(`${user.username}'s avatar`)
                        .setImage(avatarurl);
                }
                if (banneron && !avataron) {
                    bannerbtn.setDisabled(true);
                    avatar.setDisabled(false);
                } else if (!banneron && avataron) {
                    avatar.setDisabled(true);
                    bannerbtn.setDisabled(false);
                }
                if (!isbanner && banneron) {
                    await message
                        .edit({
                            embeds: [embed],
                            files: [banner],
                            components: [row],
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    await message
                        .edit({
                            embeds: [embed],
                            files: [],
                            components: [row],
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                confirmation.resetTimer();
            });
            confirmation.on("end", async () => {
                embed.setColor("Red");
                if (!isbanner && banneron) {
                    await message
                        .edit({
                            embeds: [embed],
                            files: [banner],
                            components: [],
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    await message
                        .edit({
                            embeds: [embed],
                            files: [],
                            components: [],
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
        } catch (err) {
            console.log(err);
        }
    },
};
