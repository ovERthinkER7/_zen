const { EmbedBuilder } = require("discord.js");
const math = require("mathjs");
function expandShortForms(expression) {
    const shortForms = {
        k: 1000,
        m: 1000000,
        b: 1000000000,
    };
    return expression.replace(
        /([0-9.]+)([kKmMbB])(?=\b|[+*/-])/g,
        (match, number, shortForm) =>
            parseFloat(number) * shortForms[shortForm.toLowerCase()]
    );
}
function evaluateExpression(expression) {
    // Check if the string only contains digits
    if (/^\d+$/.test(expression)) {
        return null;
    }
    if (expression.length == 1) {
        return null;
    }
    expression = expandShortForms(expression);
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
    if (result === null) {
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
