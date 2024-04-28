const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { paginationEmbed } = require("../../utils/pagination");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List of all bot commands"),
    run: async ({ interaction, client }) => {
        const commandFolder = fs
            .readdirSync("./src/commands")
            .filter((folder) => !folder.startsWith("."));
        const commands = [];
        for (const folder of commandFolder) {
            if (folder == "addmin") continue;
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            for (const file of commandFiles) {
                const { default: command } = await import(
                    `./../${folder}/${file}`
                );
                commands.push({
                    name: command.data.name,
                    description: command.data.description,
                });
            }
        }
        try {
            if (commands.length > 10) {
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
                commands.forEach((s, i) => {
                    if (currentEmbedItems.length < 10)
                        currentEmbedItems.push(s);
                    else {
                        embedItemArray.push(currentEmbedItems);
                        currentEmbedItems = [s];
                    }
                });
                embedItemArray.push(currentEmbedItems);
                embedItemArray.forEach((x) => {
                    let emb = new EmbedBuilder()
                        .setColor("Aqua")
                        .setTitle("Help")
                        .setDescription("List of all commands")
                        .addFields(
                            x.map((e) => {
                                return {
                                    name: `/${e.name}`,
                                    value: `> ${e.description}`,
                                };
                            })
                        )
                        .setTimestamp()
                        .setThumbnail(
                            `${client.user.displayAvatarURL({ dynamic: true })}`
                        );
                    pages.push(emb);
                });
                await paginationEmbed(interaction, pages, buttonList);
            } else {
                const emb = new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle("Help")
                    .setDescription("List of all commands")
                    .addFields(
                        commands.map((e) => {
                            return {
                                name: `/${e.name}`,
                                value: `> ${e.description}`,
                            };
                        })
                    )
                    .setTimestamp()
                    .setThumbnail(
                        `${client.user.displayAvatarURL({ dynamic: true })}`
                    );
                await interaction.reply({ embeds: [emb] });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
