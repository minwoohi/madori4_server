const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const mediaSchema = mongoose.Schema({
		mediaId : {type:String, required: true, unique: true},
    placeId : {type:String, required:false},
    reviewId : {type:String, required:false},
    fileName : {type:String, required:false},
    fileUrl : {type:String, required:true},
    regDate : {type:Date, default: Date.now, required:true}
});

mediaSchema.statics.findPlace = async function (mediaId) {
	return this.findOne({mediaId});
}

mediaSchema.statics.createPlace = async function (payload) {
	const media = new this(payload);
	return media.save();
}

mediaSchema.statics.updatePlace = async function(mediaId, payload) {
	return this.findOneAndUpdate({ mediaId }, payload, {new: true}).exec();
}

mediaSchema.statics.deletePlace = async function(mediaId) {
	return this.deleteOne({mediaId});
}

module.exports = mongoose.model('media', mediaSchema);
