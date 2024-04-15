const { nanoid } = require("nanoid");
const { model, Schema } = require("mongoose");

let reminderschema = new Schema({
    uniqueId: {
        type: String,
        required: true,
        default: () => nanoid(7),
        index: { unique: true },
    },
    Guild: String,
    User: String,
    Time: String,
    Remind: String,
});

module.exports = model("reminder", reminderschema);
