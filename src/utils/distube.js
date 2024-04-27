const client = require("../index.js");
const { EmbedBuilder } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

let spotifyOptions = {
    parallel: true,
    emitEventsAfterFetching: true,
};
client.distube = new DisTube(client, {
    leaveOnFinish: true,
    searchCooldown: 10,
    leaveOnEmpty: true,
    emptyCooldown: 180,
    leaveOnStop: false,
    nsfw: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    plugins: [
        new SoundCloudPlugin(),
        new YtDlpPlugin(),
        new SpotifyPlugin(spotifyOptions),
    ],
});
const isspotify = true;
if (isspotify) {
    console.log("[INFO] You're (Enabled) Spotify More Tracks Support!");
    spotifyOptions.api = {
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
    };
}

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
// DisTube event listeners
client.distube
    .on("playSong", (queue, song) => {
        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("🎵 Playing")
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.name}](${song.url})`)
            .addFields(
                {
                    name: `**Views:**`,
                    value: song.views.toString(),
                    inline: true,
                },
                {
                    name: `**Duration:**`,
                    value: song.formattedDuration.toString(),
                    inline: true,
                },
                {
                    name: `**Status**`,
                    value: status(queue).toString(),
                    inline: false,
                }
            )
            .setFooter({
                text: `Requested by ${song.user.username}`,
                iconURL: song.user.avatarURL(),
            })
            .setTimestamp();
        queue.textChannel.send({ embeds: [embed] });
    })
    .on("addList", (queue, playlist) => {
        module.exports = {
            thumbnail: playlist.thumbnail,
            name: playlist.name,
            url: playlist.url,
            queues: queue,
            formattedDuration: playlist.formattedDuration,
            user: playlist.user,
            isplaylist: true,
        };
    })
    .on("addSong", (queue, song) => {
        // var issongs = queue.songs.length == 1 ? "song" : "songs";
        // const embed = new EmbedBuilder()
        //     .setTitle("🎵 Added to queue")
        //     .setDescription(`[${song.name}](${song.url})`)
        //     .addFields(
        //         { name: `Requested by`, value: `${song.user}`, inline: true },
        //         {
        //             name: `Duration`,
        //             value: `\`${song.formattedDuration}\``,
        //             inline: true,
        //         },
        //         {
        //             name: `Queue`,
        //             value: `${queue.songs.length} ${issongs} - \`${queue.formattedDuration}\``,
        //             inline: true,
        //         }
        //     )
        //     .setThumbnail(song.thumbnail)
        //     .setColor("Aqua")
        //     .setTimestamp();
        // queue.textChannel.send({ embeds: [embed] });
        module.exports = {
            thumbnail: song.thumbnail,
            name: song.name,
            url: song.url,
            queues: queue,
            formattedDuration: song.formattedDuration,
            user: song.user,
            isplaylist: false,
        };
    })
    .on("error", (textChannel, e) => {
        console.error(e);
        textChannel.send(`An error encountered: ${e}`);
    })
    // .on("finish", (queue) =>
    //     queue.textChannel.send(
    //         "***No more song in queue. Leaving the channel***"
    //     )
    // )
    // .on("finishSong", (queue) => {
    //     const embed = new EmbedBuilder().setDescription(
    //         `:white_check_mark: | Finished playing \`${queue.songs[0].name}\``
    //     );
    //     queue.textChannel.send({ embeds: [embed] });
    // })
    // .on("disconnect", (queue) => {
    //     const embed = new EmbedBuilder().setDescription(
    //         ":x: | Disconnected from voice channel"
    //     );
    //     queue.textChannel.send({ embeds: [embed] });
    // })
    .on("empty", (queue) => {
        const embed = new EmbedBuilder()
            .setDescription(":x: | Channel is empty. Leaving the channel!")
            .setColor("Aqua");
        queue.textChannel.send({ embeds: [embed] });
    })
    .on("initQueue", (queue) => {
        queue.autoplay = false;
        queue.volume = 100;
    });
