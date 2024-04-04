const { model, Schema } = require("mongoose");

let reminderschema = new Schema({
    User: String,
    Time: String,
    Remind: String,
});

module.exports = model("reminder", reminderschema);
