const { EmbedBuilder } = require("discord.js");
const plog = require("../../models//presencelog");

module.exports = async (oldp, newp, client, handler) => {
    if (!newp.guild || newp.user.bot) return;

    // console.log(oldp.user.displayAvatarURL({ dynamic: true }));
    var data = await plog.findOne({ Guild: newp.guild.id });
    if (!data) return;
    var sendchannel = await newp.guild.channels.fetch(data.Logchannel);
    var embed;
    var old;
    if (!oldp) old = "offline";
    else old = oldp.status;
    if (old == newp.status) return;
    if (old !== "offline" && newp.status !== "offline") return;
    try {
        embed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription(
                `**Member Status Change** \n\n**Member:** ${newp.user}\n**Previous Status:** \`${old}\` ➡️ **New Status:** \`${newp.status}\``
            )
            .setTimestamp()
            .setAuthor({
                name: newp.user.username,
                iconURL: newp.user.displayAvatarURL({ dynamic: true }),
            });
    } catch (err) {
        console.log(err);
    }
    await sendchannel.send({ embeds: [embed] });
};
