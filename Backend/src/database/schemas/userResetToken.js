const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userResetTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    resetToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }, // 30 days
});

module.exports = mongoose.model("UserResetToken", userResetTokenSchema);