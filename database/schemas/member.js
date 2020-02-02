const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
//var autoIncrement = require('mongoose-auto-increment');

const memberSchema = mongoose.Schema({
    memberId : {type:String, required:true, unique:true},
    nickName : {type:String, required:false},
    thumbnailImage : {type:String, required:false},
    profileImage : {type:String, required:false},
    ageRange : {type:String, required:false},
    gender : {type:String, required:false},
    email : {type:String, required:false},
    auth : {type:String, required:false},
    regDate : {type:Date, default: Date.now, required:false}
});

memberSchema.statics.findMember = async function(memberId) {
	return this.findOne({memberId});
}

memberSchema.statics.createMember = async function (payload) {
	const member = new this(payload);
	return member.save();
}

memberSchema.statics.updateMember = async function(memberId, payload) {
	return this.findOneAndUpdate({ memberId }, payload, {new: true});
	//return this.findOneAndUpdate({ placeId }, payload, {new: true});
}

memberSchema.statics.deleteMember = async function(memberId) {
	return this.deleteOne({memberId});
}

//module.exports = mongoose.model('spot', spotSchema);
module.exports = mongoose.model('member', memberSchema);
