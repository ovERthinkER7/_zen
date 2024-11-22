const { EmbedBuilder } = require("discord.js");
const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Loop: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? "All Queue"
                : "This Song"
            : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
    }\``;
module.exports = async (client, queue, song) => {
    const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("🎵 Playing")
        .setThumbnail(song.thumbnail)
        .setDescription(`[${song.name}](${song.url})`)
        .addFields({
            name: `**Status**`,
            value: status(queue).toString(),
            inline: false,
        })
        .setFooter({
            text: `Requested by ${song.user.username}`,
            iconURL: song.user.avatarURL(),
        })
        .setTimestamp();

    await queue.textChannel?.send({ embeds: [embed] });
};
