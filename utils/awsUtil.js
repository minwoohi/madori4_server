const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
const S3 = new AWS.S3();

exports.getObjects = async function(params) {
	return await S3.listObjectsV2(params).promise();
}

exports.deleteFolder = async function(params) {
		const listObjects = await S3.listObjectsV2(params).promise();

		if(listObjects.Contents.length === 0) {
			return new Promise(function (resolve, reject) {
				resolve(true);
			});
		}

		const deleteParams = {
			Bucket : params.Bucket,
			Delete : { Objects: []}
		};

	listObjects.Contents.forEach(element => {
		deleteParams.Delete.Objects.push({Key : element.Key});
	});

	await S3.deleteObjects(deleteParams).promise();

	if(listObjects.IsTruncated) {
		let obj = Object.assign({}, params, {
			ContinuationToken: listObjects.NextContinuationToken
		});
		await this.deleteFolder(obj);
	} else {
		return new Promise(function (resolve, reject) {
			resolve(true);
		});
	}
}

exports.deleteBucket = async function(params) {
		await S3.deleteBucket(params).promise();

		return new Promise(function (resolve, reject) {
			resolve(true);
		});
}
