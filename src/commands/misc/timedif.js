const {
    SlashCommandBuilder,
    EmbedBuilder,
    SnowflakeUtil,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timedif")
        .setDescription(
            "Gives the time difference between two discord messages."
        )
        .addStringOption((opt) =>
            opt
                .setName("message_id_1")
                .setDescription("Enter message ID 1")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("message_id_2")
                .setDescription("Enter message ID 2")
                .setRequired(false)
        ),
    run: async ({ client, interaction }) => {
        function makeNumbersBold(inputString) {
            // Regular expression to match numbers with optional decimal parts
            var regex = /\b\d+(\.\d+)?\b/g;

            return inputString.replace(regex, function (match) {
                return "**" + match + "**";
            });
        }
        const { options } = interaction;
        const message_id_1 = options.get("message_id_1").value;
        var message_id_2 = options.get("message_id_2")?.value || "1";
        var difmsg = "two given IDs";
        if (isNaN(message_id_1) && isNaN(message_id_2)) {
            await interaction.reply(`invalid id`);
            return;
        }
        if (message_id_2 === "1") {
            message_id_2 = SnowflakeUtil.generate();
            difmsg = "given ID and command message Id";
        }
        const id1 = SnowflakeUtil.deconstruct(message_id_1);
        const id2 = SnowflakeUtil.deconstruct(message_id_2);
        const time1 = Number(id1.timestamp);
        const time2 = Number(id2.timestamp);
        const diftimems = Math.abs(time1 - time2);
        const { default: ms } = await import("pretty-ms");
        const diftime = ms(diftimems, {
            verbose: true,
            keepDecimalsOnWholeSeconds: true,
            secondsDecimalDigits: 2,
        });

        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Time Difference")
            .setDescription(`${makeNumbersBold(diftime)}`)
            .addFields(
                {
                    name: `${message_id_1}`,
                    value: `sent <t:${Math.floor(
                        time1 / 1000
                    )}:D>,<t:${Math.floor(time1 / 1000)}:T>`,
                    inline: true,
                },
                {
                    name: `${message_id_2}`,
                    value: `sent <t:${Math.floor(
                        time2 / 1000
                    )}:D>,<t:${Math.floor(time2 / 1000)}:T>`,
                    inline: true,
                }
            )
            .setFooter({ text: `Showing difference between the ${difmsg}` })
            .setTimestamp();
        try {
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            return;
        }
    },

    // options: {
    //     devOnly: true,
    // },
};
