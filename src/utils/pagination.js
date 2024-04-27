const {
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");
/**
 * Creates a pagination embed
 * @param {Interaction} interaction
 * @param {EmbedBuilder[]} pages
 * @param {ButtonBuilder[]} buttonList
 * @param {number} timeout
 * @returns
 */
module.exports = {
    paginationEmbed: async (
        interaction,
        pages,
        buttonList,
        timeout = 120000
    ) => {
        try {
            if (!pages) throw new Error("Pages are not given.");
            if (!buttonList) throw new Error("Buttons are not given.");
            if (
                buttonList[0].style === ButtonStyle.Link ||
                buttonList[1].style === ButtonStyle.Link
            )
                throw new Error("The button style can't be LINK.");
            if (buttonList.length !== 2) throw new Error("Need two buttons.");

            let page = 0;

            const row = new ActionRowBuilder().addComponents(buttonList);

            //has the interaction already been deferred? If not, defer the reply.
            if (interaction.deferred === false) {
                await interaction.deferReply();
            }

            const curPage = await interaction.editReply({
                embeds: [
                    pages[page].setFooter({
                        text: `Page ${page + 1} / ${pages.length}`,
                    }),
                ],
                components: [row],
                fetchReply: true,
            });

            const filter = (i) => i.user.id === interaction.user.id;

            const collector = await curPage.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: timeout,
            });

            collector.on("collect", async (i) => {
                await i.deferUpdate();
                switch (i.customId) {
                    case "previousbtn":
                        page = page > 0 ? --page : pages.length - 1;
                        break;
                    case "nextbtn":
                        page = page + 1 < pages.length ? ++page : 0;
                        break;
                    default:
                        break;
                }

                await i.editReply({
                    embeds: [
                        pages[page].setFooter({
                            text: `Page ${page + 1} / ${pages.length}`,
                        }),
                    ],
                    components: [row],
                });
                collector.resetTimer();
            });

            collector.on("end", () => {
                if (!curPage.deleted) {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        buttonList[0].setDisabled(true),
                        buttonList[1].setDisabled(true)
                    );
                    curPage.edit({
                        embeds: [
                            pages[page].setFooter({
                                text: `Page ${page + 1} / ${pages.length}`,
                            }),
                        ],
                        components: [disabledRow],
                    });
                }
            });

            return curPage;
        } catch (err) {
            console.log(err);
        }
    },
};
