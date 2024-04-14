const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emojify")
        .setDescription("Change text to emojis")
        .addStringOption((opt) =>
            opt
                .setName("text")
                .setDescription("The text to convert")
                .setRequired(true)
                .setMaxLength(2000)
                .setMinLength(1)
        )
        .addStringOption((opt) =>
            opt
                .setName("hidden")
                .setDescription("Hide this message?")
                .addChoices(
                    { name: "Hidden", value: "true" },
                    { name: "Not hidden", value: "false" }
                )
                .setRequired(false)
        ),
    run: async ({ interaction, client, handler }) => {
        const text = interaction.options.getString("text");
        const hidden = interaction.options.getString("Hidden") || false;
        if (hidden == "true") hidden = true;
        else if (hidden == "false") hidden = false;
        var emojitext = text
            .toLowerCase()
            .split("")
            .map((letter) => {
                const regex = /^[A-Za-z]+$/;
                if (letter == " ") return " ";
                if (regex.test(letter)) {
                    return `:regional_indicator_${letter}:`;
                } else {
                    return letter;
                }
            })
            .join("");

        if (emojitext.length >= 2000)
            emojitext = `I can emojify this text-- it is too long`;

        await interaction.reply({ content: emojitext, ephemeral: hidden });
    },
};
