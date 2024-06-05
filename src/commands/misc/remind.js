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
        )
        .addSubcommand((cmd) =>
            cmd
                .setName("list")
                .setDescription("See all yours current reminders")
        )
        .addSubcommand((cmd) =>
            cmd
                .setName("remove")
                .setDescription("Removes one of yours reminder")
                .addStringOption((opt) =>
                    opt
                        .setName("id")
                        .setDescription("Enter ID to remove")
                        .setRequired(true)
                )
        )
        .addSubcommand((cmd) =>
            cmd
                .setName("delete")
                .setDescription(
                    "If used in server delete all reminders set in that server,if in dm delete all reminders."
                )
        ),
    run: async ({ interaction, client, handler }) => {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "set":
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
                var guild;
                if (interaction.inGuild()) guild = interaction.guild.id;
                else guild = "DM";
                const setreminder = await remindschema.create({
                    Guild: guild,
                    User: interaction.user.id,
                    Time: time,
                    Remind: reminder,
                });
                const embed = new EmbedBuilder()
                    .setColor("Aqua")
                    .setDescription(
                        `📩 | ${
                            interaction.user
                        } your reminder has been set! I'll will remind about **${reminder}** <t:${Math.floor(
                            time / 1000
                        )}:R>! **ID** : \`${setreminder.uniqueId}\``
                    );
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            case "list":
                const embedlist = new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle(":bell: **Reminders**");
                if (!interaction.inGuild()) {
                    var data = await remindschema.find({
                        User: interaction.user.id,
                    });
                    if (data <= 0) {
                        embedlist.setDescription("You have no reminders set!");
                        await interaction.reply({
                            embeds: [embedlist],
                        });
                        return;
                    }
                    let list = "";
                    data.forEach((ele) => {
                        list += `**ID** : \`${
                            ele.uniqueId
                        }\` **Time** : <t:${Math.floor(
                            ele.Time / 1000
                        )}:R> **Message** : \`${ele.Remind}\`\n\n`;
                    });
                    embedlist.setDescription(list);
                    await interaction
                        .reply({
                            embeds: [embedlist],
                            ephemeral: true,
                        })
                        .catch((err) => console.log(err));
                    return;
                } else {
                    var data = await remindschema.find({
                        Guild: interaction.guild.id,
                        User: interaction.user.id,
                    });
                    if (data.length <= 0) {
                        embedlist.setDescription("You have no reminders set!");
                        await interaction.reply({
                            embeds: [embedlist],
                            ephemeral: true,
                        });
                        return;
                    }
                    let list = "";
                    data.forEach((ele) => {
                        list += `**ID** : \`${
                            ele.uniqueId
                        }\` **Time** : <t:${Math.floor(
                            ele.Time / 1000
                        )}:R> **Message** : \`${ele.Remind}\`\n\n`;
                    });
                    embedlist.setDescription(list);
                    await interaction
                        .reply({
                            embeds: [embedlist],
                            ephemeral: true,
                        })
                        .catch((err) => console.log(err));
                    return;
                }
            case "remove":
                const id = interaction.options.getString("id");
                const deleteembed = new EmbedBuilder().setColor("Aqua");
                try {
                    const deleted = await remindschema.deleteOne({
                        uniqueId: id,
                    });
                    if (deleted.deletedCount >= 1) {
                        deleteembed.setDescription(
                            "✅ | Successfully removed reminder!"
                        );
                        await interaction
                            .reply({
                                embeds: [deleteembed],
                                ephemeral: true,
                            })
                            .catch((err) => console.log(err));
                    } else {
                        deleteembed.setDescription(
                            "⚠️ | Could not find a reminder with that id from you.To get a list of your reminders, use the </remind list:1225466582910767174> command."
                        );
                        await interaction
                            .reply({
                                embeds: [deleteembed],
                                ephemeral: true,
                            })
                            .catch((err) => console.log(err));
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            case "delete":
                let dembed = new EmbedBuilder();
                if (!interaction.inGuild()) {
                    try {
                        const deleted = await remindschema.deleteMany({
                            User: interaction.user.id,
                        });
                        if (deleted.deletedCount >= 1) {
                            dembed
                                .setDescription(
                                    "✅ | Successfully deleted all reminders!"
                                )
                                .setColor("Aqua");
                            await interaction
                                .reply({
                                    embeds: [dembed],
                                    ephemeral: true,
                                })
                                .catch((err) => console.log(err));
                        } else {
                            dembed
                                .setDescription(
                                    "⚠️ | You don't have any reminder set. To set reminder, use the </remind set:1225466582910767174> command."
                                )
                                .setColor("Red");
                            await interaction
                                .reply({
                                    embeds: [dembed],
                                    ephemeral: true,
                                })
                                .catch((err) => console.log(err));
                        }
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    try {
                        const deleted = await remindschema.deleteMany({
                            User: interaction.user.id,
                            Guild: interaction.guild.id,
                        });
                        console.log(deleted);
                        if (deleted.deletedCount >= 1) {
                            dembed
                                .setDescription(
                                    `✅ | Successfully deleted all reminders in **${interaction.guild.name}**!`
                                )
                                .setColor("Aqua");
                            await interaction
                                .reply({
                                    embeds: [dembed],
                                    ephemeral: true,
                                })
                                .catch((err) => console.log(err));
                        } else {
                            dembed
                                .setDescription(
                                    "⚠️ | You don't have any reminder set. To set reminder, use the </remind set:1225466582910767174> command."
                                )
                                .setColor("Red");
                            await interaction
                                .reply({
                                    embeds: [dembed],
                                    ephemeral: true,
                                })
                                .catch((err) => console.log(err));
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
        }
    },
};
