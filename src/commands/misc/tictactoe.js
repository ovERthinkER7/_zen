const { SlashCommandBuilder } = require("discord.js");
const tictactoe = require("discord-tictactoe");
const game = new tictactoe({ language: "en", commandOptionName: "user" });
module.exports = {
    data: new SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Play TicTacToe with user or bot")
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("Pick the user you wanna play with")
                .setRequired(false)
        ),
    run: async ({ interaction, client, handler }) => {
        try {
            game.handleInteraction(interaction);
        } catch (error) {
            console.log(error);
        }
    },
};
