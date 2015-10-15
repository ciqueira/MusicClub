var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    uid: { type: String, required: true, unique: true },
    provider: String,
    fistName: String,
    lastName: String,
    name: String,
    email: String,
    photoUrl: String,
    shareSongs: Number,
    drive: {
        tokenType: String,
        expiresIn: Number,
        scope: String,
        accessToken: String,
        refreshToken: String,
        userId: String,
        lastUpdateDateTime: Number
    },
    follow: [{ type: Schema.ObjectId, ref: 'User' }],
    createDate: Number,
    updateDate: Number
});

var User = mongoose.model('User', userSchema);

module.exports = User;