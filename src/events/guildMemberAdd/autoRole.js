const AutoRole = require("../../models/AutoRole");

module.exports = async (member, client) => {
    try {
        let guild = member.guild;
        if (!guild) return;

        const autoRole = await AutoRole.findOne({ guildId: guild.id });
        if (!autoRole) return;

        await member.roles.add(autoRole.roleId);
    } catch (error) {
        console.log(`Error giving role automatically: ${error}`);
    }
};
