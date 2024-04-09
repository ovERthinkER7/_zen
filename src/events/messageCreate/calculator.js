const { EmbedBuilder } = require("discord.js");
const math = require("mathjs");
function evaluateExpression(expression) {
    // Check if the string only contains digits
    if (/^\d+$/.test(expression)) {
        return null;
    }
    try {
        const parser = math.parser();
        const result = parser.evaluate(expression);
        return result;
    } catch (err) {
        return null;
    }
}

module.exports = async (message, client, handler) => {
    if (message.author.bot || !message.inGuild()) return;
    var cal = message.content;
    const result = evaluateExpression(cal);
    if (!evaluateExpression(cal)) {
        return;
    } else {
        const channel = message.channel;
        try {
            if (isNaN(result)) {
                const embed = new EmbedBuilder()
                    .setColor("Aqua")
                    .setDescription(`**Calculated** ${result}`);
                await channel.send({ embeds: [embed] });
            } else {
                const formattedresult = parseFloat(result.toFixed(2));
                const embed = new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle(`Calculated ${Math.floor(result)}`)
                    .setDescription(
                        `**Solved:** \`${formattedresult.toLocaleString()}\`\n**Raw:** \`${result}\``
                    );
                await channel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err);
        }
    }
};
