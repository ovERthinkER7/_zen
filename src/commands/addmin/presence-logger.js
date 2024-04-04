const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");
const plog = require("../../models/presencelog");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("presence-logger")
        .setDescription("Log the presence of user in the server")
        .addSubcommand((cmd) =>
            cmd
                .setName("add")
                .setDescription("Add a presence logger channel")
                .addChannelOption((opt) =>
                    opt
                        .setName("log-channel")
                        .setDescription("Channel to log presence in")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((cmd) =>
            cmd
                .setName("remove")
                .setDescription("Remove presence logger from the server")
        ),
    run: async ({ interaction, client, handler }) => {
        const { options } = interaction;
        const sub = options.getSubcommand();
        var logchannel = options.getChannel("log-channel");
        var data = await plog.findOne({
            Guild: interaction.guild.id,
        });
        async function sendMessage(message) {
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(message);
            await interaction.reply({ embeds: [embed] });
        }
        switch (sub) {
            case "add":
                if (data) {
                    await sendMessage(
                        `⚠️ Look like the presence logger system is already setup.`
                    );
                } else {
                    await plog.create({
                        Guild: interaction.guild.id,
                        Logchannel: logchannel.id,
                    });
                    await sendMessage(
                        `🌏 The presence logger system is now enabled! And will logged into ${logchannel}.`
                    );
                }
                break;
            case "remove":
                if (!data) {
                    await sendMessage(`⚠️ There no presence log system.`);
                } else {
                    await plog.deleteOne({
                        Guild: interaction.guild.id,
                    });
                    await sendMessage(
                        `🌏 I have disable the presence log system.`
                    );
                }
        }
        // interaction.reply()
    },
    options: {
        userPermission: ["Administrator"],
        botPermission: ["Administrator"],
    },
};
