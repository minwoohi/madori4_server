const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true
	},
	coordinates: {
		type: [Number],
		required: true
	}
});

const placeSchema = mongoose.Schema({
		placeId : {type:Number, required: true, unique: true},
    memberId : {type:String, required:true},
		location: pointSchema,
    title : {type:String, required:false},
    description : {type:String, required:false},
    locality : {type:String, required:false},
    thoroughfare : {type:String, required:false},
    regDate : {type:Date, default: Date.now, required:true}
});

pointSchema.index({ location : '2dsphere' });

placeSchema.statics.findPlace = async function (spotId) {
	return this.findOne({placeId});
}

placeSchema.statics.createPlace = async function (payload) {
	const place = new this(payload);
	return place.save();
}

placeSchema.statics.updatePlace = async function(placeId, payload) {
	return this.findOneAndUpdate({ placeId }, payload, {new: true}).exec();
	//return this.findOneAndUpdate({ placeId }, payload, {new: true});
}

placeSchema.statics.deletePlace = async function(placeId) {
	return this.deleteOne({placeId});
}

placeSchema.plugin(autoIncrement.plugin, {
	model : 'place',
	field : 'placeId',
	startAt : 0,
	increment : 1
});

module.exports = mongoose.model('place', placeSchema);
