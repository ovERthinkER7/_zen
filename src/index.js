require("dotenv").config();
const {
    Client,
    IntentsBitField,
    ActivityType,
    EmbedBuilder,
} = require("discord.js");
const fs = require("node:fs");
const mongoose = require("mongoose");
const { CommandKit } = require("commandkit");
const remindschema = require("./models//reminder");
const keepAlive = require("./keep_alive");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

client.CurrentSongs = [];

module.exports.client = client;
require("./utils/distube.js");

new CommandKit({
    client,
    devUserIds: ["586580387405496340"],
    eventsPath: `${__dirname}/events`,
    commandsPath: `${__dirname}/commands`,
    devUserIds: ["586580387405496340"],
    devGuildIds: [
        "828955405676969984",
        "1030924407817916526",
        "1194574229937602574",
    ],
    // validationsPath: `${__dirname}/validations`,
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
// prevent crash on unhandled promise rejection
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});

// prevent crash on uncaught exception
process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
});
setInterval(async () => {
    const reminders = await remindschema.find();
    if (!reminders) return;
    else {
        reminders.forEach(async (reminder) => {
            if (reminder.Time > Date.now()) return;

            const user = await client.users.fetch(reminder.User);
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setTitle(":bell: **Reminder**")
                .setDescription(
                    `${user}, you asked to be reminded of **${reminder.Remind}.**`
                );
            user?.send({
                embeds: [embed],
            }).catch((err) => {
                return;
            });

            await remindschema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind,
            });
        });
    }
}, 1000 * 5);

console.log(`Loading DisTube Events`);
const distubeEvents = fs
    .readdirSync(`src/events/distube`)
    .filter((file) => file.endsWith(".js"));
for (const file of distubeEvents) {
    const event = require(`./events/distube/${file}`);
    client.distube.on(file.split(".")[0], event.bind(null, client));
}

keepAlive();
