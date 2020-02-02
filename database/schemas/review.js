const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

const reviewSchema = mongoose.Schema({
		reviewId : {type:Number, required: true, unique: true},
		placeId : {type:String, required: true},
		memberId : {type:String, required: true},
		reviewerId : {type:String, required: true},
    comment : {type:String, required:true},
    regDate : {type:Date, default: Date.now, required:true}
});

reviewSchema.statics.findReview = async function (reviewId) {
	return this.findOne({reviewId});
}

reviewSchema.statics.createReview = async function (payload) {
	const review = new this(payload);
	return review.save();
}

reviewSchema.statics.updateReview = async function(reviewId, payload) {
	return this.findOneAndUpdate({ reviewId }, payload, {new: true}).exec();
}

reviewSchema.statics.deleteReview = async function(reviewId) {
	return this.deleteOne({reviewId});
}

reviewSchema.plugin(autoIncrement.plugin, {
	model : 'review',
	field : 'reviewId',
	startAt : 0,
	increment : 1
});

module.exports = mongoose.model('review', reviewSchema);
