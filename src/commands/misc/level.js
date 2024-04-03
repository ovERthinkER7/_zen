const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const canvacord = require("canvacord");
// const calculateLevelXp = require("../../utils/calculateLevelXp");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Level = require("../../models/Level");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Show your/someone's level")
        .addUserOption((opt) =>
            opt
                .setName("target-user")
                .setDescription("The user whose level you want to see")
                .setRequired(false)
        )
        .setDMPermission(false),
    run: async ({ interaction, client, handler }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        await interaction.deferReply();

        const mentionedUser = interaction.options.getUser("target-user");
        var targetUserId;
        if (!mentionedUser) {
            targetUserId = interaction.member.id;
        } else {
            targetUserId = mentionedUser.id;
        }
        const targetUserObj = await interaction.guild.members.fetch(
            targetUserId
        );

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUser
                    ? `${targetUserObj.user} doesn't have any levels yet. Try again when they chat a little more.`
                    : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
        }

        let allLevels = await Level.find({
            guildId: interaction.guild.id,
        }).select("-_id userId level xp");

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank =
            allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        const status = targetUserObj.presence?.status || "offline";
        // const status = "offline";
        // console.log(targetUserObj.presence.status);
        const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(status)
            .setProgressBar("#FFC300", "COLOR")
            .setUsername(targetUserObj.user.username)
            .setDiscriminator("0000");

        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files: [attachment] });
    },
};
