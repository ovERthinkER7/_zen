require("dotenv").config();
const {
    Client,
    IntentsBitField,
    ActivityType,
    EmbedBuilder,
} = require("discord.js");
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
    ],
});

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
keepAlive();
