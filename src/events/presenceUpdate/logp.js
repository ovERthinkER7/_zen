const { EmbedBuilder } = require("discord.js");
const plog = require("../../models//presencelog");

module.exports = async (oldp, newp, client, handler) => {
    var data = await plog.findOne({ Guild: oldp?.guild.id || "0" });
    // console.log(data + "fjdlk");
    if (!data) return;
    if (oldp.user.bot) return;
    // console.log(oldp.user.displayAvatarURL({ dynamic: true }));
    var sendchannel = await oldp.guild.channels.fetch(data.Logchannel);
    var embed;
    try {
        embed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription(
                `${oldp.user} presence's changes from **${oldp.status}** to **${newp.status}**`
            )
            .setTimestamp()
            .setAuthor({
                name: oldp.user.username,
                iconURL: oldp.user.displayAvatarURL({ dynamic: true }),
            });
    } catch (err) {
        console.log(err);
    }
    await sendchannel.send({ embeds: [embed] });
};
