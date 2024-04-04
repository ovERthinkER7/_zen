const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const remindschema = require("../../models//reminder");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remind")
        .setDescription("Set a reminder for yourself")
        .addSubcommand((cmd) =>
            cmd
                .setName("set")
                .setDescription("Set a reminder")
                .addStringOption((opt) =>
                    opt
                        .setName("reminder")
                        .setDescription("What do you want to be reminded of")
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt
                        .setName("duration")
                        .setDescription("Reminder duration(1h,30m,1 day)")
                        .setRequired(true)
                )
        ),
    run: async ({ interaction, client, handler }) => {
        const reminder = interaction.options.getString("reminder");
        const duration = interaction.options.getString("duration");
        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply({
                content: "Please provide a valid timeout duration.",
                ephemeral: true,
            });
            return;
        }
        const time = Date.now() + msDuration;
        await remindschema.create({
            User: interaction.user.id,
            Time: time,
            Remind: reminder,
        });

        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription(
                `📩 Your reminder has been set for <t:${Math.floor(
                    time / 1000
                )}:R>! I will remind you ${reminder}`
            );
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
