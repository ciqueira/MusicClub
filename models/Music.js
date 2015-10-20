var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var musicSchema = new Schema({
    idFile: String,
    sharedBy: { type: Schema.ObjectId, ref: 'User' },
    size: Number,
    nameFile: String,
    streamUrl: String,
    album: String,
    albumArtist: String,
    artist: String,
    //composers: String,
    duration: Number,
    title: String,
    thumbnailUrl: String,
    createDate: Number,
    updateDate: Number
});

var Music = mongoose.model('Music', musicSchema);

module.exports = Music;