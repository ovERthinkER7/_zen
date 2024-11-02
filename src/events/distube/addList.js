const Discord = require("discord.js");

module.exports = async (client, queue, playlist) => {
    const embed = new Discord.EmbedBuilder()
        .setColor("Aqua")
        .setTitle("📃 New Queue")
        .setDescription(
            `New playlist to the queue\n**Playlist:** [${playlist.name} (${playlist.songs.length} songs)](${playlist.url}))`
        )
        .setFooter({
            text: `Requested by ${
                playlist.songs[0].user.globalName ||
                playlist.songs[0].user.username
            }`,
            iconURL: playlist.songs[0].user.displayAvatarURL({ size: 1024 }),
        });

    await queue.textChannel?.send({ embeds: [embed] });
};
