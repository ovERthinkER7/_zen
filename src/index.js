require("dotenv").config();
const { Client, IntentsBitField, ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const { CommandKit } = require("commandkit");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ],
});

new CommandKit({
    client,
    devUserIds: ["586580387405496340"],
    eventsPath: `${__dirname}/events`,
    commandsPath: `${__dirname}/commands`,
    validationsPath: `${__dirname}/validations`,
    // bulkRegister: true,
});
(async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        client.on("ready", (c) => {
            client.user.setActivity({
                name: "zen zen zense",
                type: ActivityType.Listening,
            });
        });

        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
