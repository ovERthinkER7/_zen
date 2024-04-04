const { Schema, model } = require("mongoose");

let presencelog = new Schema({
    Guild: String,
    Logchannel: String,
});
module.exports = model("presencelog", presencelog);
