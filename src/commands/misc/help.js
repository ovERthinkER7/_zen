const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Help")
            .setDescription("List of all commands")
            .addFields(
                commands.map((command) => {
                    return {
                        name: `/${command.name}`,
                        value: `> ${command.description}`,
                    };
                })
            )
            .setTimestamp()
            .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`);
        await interaction.reply({ embeds: [embed] });
    },
};
