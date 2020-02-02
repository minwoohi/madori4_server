module.exports = function(app) {
const request = require('request');
const Place = require('../database/schemas/place');
const Member = require('../database/schemas/member');
const awsUtil = require('../utils/awsUtil');
//const Img = require('../database/schemas/image');

	/**
	 * @swagger
	 * definitions:
	 *   Place:
	 *     type: object
	 *     properties:
	 *       placeId:
	 *         type: string
	 *         description: Place의 id
	 *       memberId:
	 *         type: string
	 *         description: writer id
	 *       title:
	 *         type: string
	 *         description: 장소명
	 *       latitude:
	 *         type: string
	 *         description: 위도
	 *       longitude:
	 *         type: string
	 *         description: 경도
	 *       description:
	 *         type: string
	 *         description: 설명
	 *       locality:
	 *         type: string
	 *         description: 지역구명 검색용
	 *       thoroughfare:
	 *         type: string
	 *         description: 도로명 주소
	 *       regDate:
	 *         type: string
	 *         format: date-time
	 *         description: 날짜
	 *   Member:
	 *     type: object
	 *     properties:
	 *       memberId:
	 *         type: string
	 *         description: member id
	 *       nickName:
	 *         type: string
	 *         description: nickName
	 *       profileImage:
	 *         type: string
	 *         description: profileImage
	 *       thumbnailImage:
	 *         type: string
	 *         description: thumbnailImage
	 *       ageRange:
	 *         type: string
	 *         description: user's age range
	 *       gender:
	 *         type: string
	 *         description: gender
	 *       email:
	 *         type: string
	 *         description: email address
	 *       auth:
	 *         type: string
	 *         description: authentification (write)
	 *       regDate:
	 *         type: string
	 *         format: date-time
	 *         description: 날짜
	 *   Media:
	 *     type: object
	 *     properties:
	 *       mediaFileId:
	 *         type: string
	 *         description: file id (uuid)
	 *       placeId:
	 *         type: string
	 *         description: place id exclusive with reviewId
	 *       reviewId:
	 *         type: string
	 *         description: review id exclusive with placeId
	 *       fileName:
	 *         type: string
	 *         description: fileName
	 *       filePath:
	 *         type: string
	 *         description: file path
	 *       fileUrl:
	 *         type: string
	 *         description: file UR L
	 *       regDate:
	 *         type: string
	 *         format: date-time
	 *         description: 날짜
	 *   Review:
	 *     type: object
	 *     properties:
	 *       reviewId:
	 *         type: string
	 *         description: reviwe id
	 *       placeId:
	 *         type: string
	 *         description: place id
	 *       comment:
	 *         type: string
	 *         description: review comment
	 *       regDate:
	 *         type: string
	 *         format: date-time
	 *         description: 날짜
	 */


	/**
	 * @swagger
	 * paths: 
	 *  /place:
	 *    get:
	 *      tags:
	 *      - "place" 
	 *      summary: "get place list"
	 *      description: "create place list"
	 *      produces:
	 *      - "apllication/json"
	 *      parameters:
	 *      - name: "placeId"
	 *        in: "query"
	 *        description: "장소 id"
	 *        type: "string"
	 *        required: false
	 *      - name: "memberId"
	 *        in: "query"
	 *        description: "member id"
	 *        type: "string"
	 *        required: false
	 *      - name: "title"
	 *        in: "query"
	 *        description: "장소명"
	 *        type: "string"
	 *        required: false
	 *      - name: "description"
	 *        in: "query"
	 *        description: "장소 소개"
	 *        type: "string"
	 *        required: false
	 *      - name: "latitude"
	 *        in: "query"
	 *        description: "위도"
	 *        type: "string"
	 *        required: false 
	 *      - name: "longitude"
	 *        in: "query"
	 *        description: "경도"
	 *        type: "string"
	 *        required: false
	 *      - name: "distance"
	 *        in: "query"
	 *        description: "반경(M 단위)"
	 *        type: "string"
	 *        required: false
	 *      - name: "locality"
	 *        in: "query"
	 *        description: "지역 (중구 등)"
	 *        type: "string"
	 *        required: false
	 *      - name: "thoroughfare"
	 *        in: "query"
	 *        description: "도로명 (노해로 등)"
	 *        type: "string"
	 *        required: false
	 *      - name: "pageSize"
	 *        in: "query"
	 *        description: "데이터 갯수"
	 *        type: "query"
	 *        format: "Number"
	 *      responses:
	 *        200:
	 *          description: "get place list success.\n file url : https://madori3.s3.ap-northeast-2.amazonaws.com/ + fileId"
	 *          schema:
	 *            $ref: "#/definitions/Place"
	 */

	app.get('/place', async function(req, res) {
		let pageSize = 100;
		let searchConditionObject = {};	// declare json object
		let query = req.query;
		let resultObj = {};
		let placeId;
		let latitude;
		let longitude;
		let distance;
		
		if(query.distance !== undefined)
			distance = query.distance;
		if(query.latitude !== undefined)
			latitude = query.latitude;
		if(query.longitude !== undefined)
			longitude = query.longitude;
		if(query.title !== undefined)	// for validation check... is created today or not
			searchConditionObject.title = query.title;
		if(query.description !== undefined)	// for validation check... is created today or not
			searchConditionObject.description = query.description;
		if(query.placeId !== undefined)	// for validation check... is created today or not
			searchConditionObject.placeId = query.placeId;
		if(query.memberId !== undefined)	// for validation check... is created today or not
			searchConditionObject.memberId = query.memberId;
		if(query.locality !== undefined)
			searchConditionObject.locality = query.locality;
		if(query.thoroughfare !== undefined)
			searchConditionObject.thoroughfare = query.thoroughfare;
		if(query.regDate !== undefined)
			searchConditionObject.regDate = query.regDate;
		if(query.pageSize !== undefined)
			pageSize = query.pageSize;

		//console.log('searchConditionObject : ' + JSON.stringify(searchConditionObject));

		if(latitude !== undefined && longitude !== undefined && distance !== undefined) {
			let location =	
				 {
					$geoWithin : {
						$centerSphere : [[longitude, latitude], distance / 6378100]	// radius to meter
					}
				}
			searchConditionObject.location = location;
		}

		Place.find(
			searchConditionObject
		)
		.sort({'regDate': -1})
		.limit(pageSize)
		.exec(function(err, spot) {
			if(err) {
				resultObj.resultCode = 500;
				resultObj.resultMsg = 'fail';
				resultObj.result = err;
				res.status(500).send(resultObj);
			}
			resultObj.resultCode = 200;
			resultObj.resultMsg = 'success';
			resultObj.result = spot;
			res.status(200).send(resultObj);
		});
	});

	/**
	 * @swagger
	 * /place:
	 *   post:
	 *     tags: 
	 *     - "place"
	 *     summary: "create place"
	 *     description: "create place"
	 *     consumes:
	 *     - "application/x-www-form-urlencoded"
	 *     parameters:
	 *     - name: "memberId"
	 *       in: "formData"
	 *       description: "login user id"
	 *       type: "string"
	 *       required: true
	 *     - name: "title"
	 *       in: "formData"
	 *       description: "장소명"
	 *       type: "string"
	 *       required: false
	 *     - name: "description"
	 *       in: "formData"
	 *       description: "장소 소개"
	 *       type: "string"
	 *       required: false
	 *     - name: "latitude"
	 *       in: "formData"
	 *       description: "latitude data"
	 *       type: "string"
	 *       required: true
	 *     - name: "longitude"
	 *       in: "formData"
	 *       description: "longitude data"
	 *       type: "string"
	 *       required: true
	 *     - name: "locality"
	 *       in: "formData"
	 *       description: "for location search"
	 *       type: "string"
	 *       required: false
	 *     - name: "thoroughfare"
	 *       in: "formData"
	 *       description: "for street search"
	 *       type: "string"
	 *       required: false
	 *     responses:
	 *       200:
	 *         description: "post place success"
	 *         schema:
	 *           $ref: "#/definitions/Place"
	 */
	let multiparty = require('multiparty');
	let fs = require('fs');

	// for AWS S3 file management
	const AWS = require('aws-sdk');
	AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
	const S3 = new AWS.S3();

	app.post('/place', function(req, res) {
		const moment = require('moment');
		let latitude;
		let longitude;
		let place = {};
		let dateTime = new Date();
		let resultObj = {};

		dateTime = moment(dateTime).format('YYYYMMDDHHmmss');

		place = req.body;

		const location = { type: 'Point', coordinates : [ req.body.longitude, req.body.latitude] };
		place.location = location;

		place.latitude = undefined;
		place.longitude = undefined;
		//place.placeId = place.memberId + '_' + dateTime;

		Place.createPlace(place).then( function(data) {
			resultObj.resultCode = 200;
			resultObj.resultMsg = 'success';
			resultObj.placeId = data.placeId;
			res.status(200).send(resultObj);
		}).catch(function (err) {
			res.status(500).send(err);
		});

	});	// app.post('/upload

	/**
	 * @swagger
	 * /place:
	 *   put:
	 *     tags:
	 *     - "place"
	 *     summary: "update place"
	 *     description: "update place"
	 *     consumes:
	 *     - "application/x-www-form-urlencoded"
	 *     parameters:
	 *     - name: "placeId"
	 *       in: "formData"
	 *       description: "place id"
	 *       type: "string"
	 *       required: true
	 *     - name: "memberId"
	 *       in: "formData"
	 *       description: "member id"
	 *       type: "string"
	 *       required: false 
	 *     - name: "latitude"
	 *       in: "formData"
	 *       description: "latitude data"
	 *       type: "string"
	 *       required: false
	 *     - name: "longitude"
	 *       in: "formData"
	 *       description: "longitude data"
	 *       type: "string"
	 *       required: false
	 *     - name: "title"
	 *       in: "formData"
	 *       description: "title"
	 *       type: "string"
	 *       required: false
	 *     - name: "locality"
	 *       in: "formData"
	 *       description: "for location search"
	 *       type: "string"
	 *       required: false
	 *     - name: "thoroughfare"
	 *       in: "formData"
	 *       description: "for street search"
	 *       type: "string"
	 *       required: false
	 *     - name: "description"
	 *       in: "formData"
	 *       description: "description"
	 *       type: "string"
	 *       required: false
	 *     responses:
	 *       200:
	 *         description: "update place success"
	 *         schema:
	 *           $ref: "#/definitions/Place"
   */
	app.put('/place', function(req, res) {
		let latitude;
		let longitude;
		let resultObj = {};
		let place = {};

		place = req.body;

		const location = { type: 'Point', coordinates : [ req.body.longitude, req.body.latitude] };
		place.location = location;

		place.latitude = undefined;
		place.longitude = undefined;

		Place.updatePlace(place.placeId, place)
			.then(function (place) {
				resultObj.resultCode = 200;
				resultObj.resultMsg = 'success';
				resultObj.result = place;
				res.status(resultObj.resultCode).send(resultObj);
			})
			.catch(function (err) {
				resultObj.resultCode = 500;
				resultObj.resultMsg = 'fail';
				resultObj.result = err;
				res.status(resultObj.resultCode).send(resultObj);
			});

	});	// app.put('/spot')

	/**
	 * @swagger
	 * /place:
	 *   delete:
	 *     tags:
	 *     - "place"
	 *     summary: "delete place"
	 *     description: "delete place"
	 *     produces:
	 *     - 'application/json'
	 *     parameters:
	 *     - name: "placeId"
	 *       in: "query"
	 *       description: "place id"
	 *       type: "string"
	 *       required: true
	 *     - name: "memberId"
	 *       in: "query"
	 *       description: "member id for bucket"
	 *       type: "string"
	 *       required: true
	 *     responses:
	 *       200:
	 *         description: "delete place success"
	 *         schema:
	 *           $ref: "#/definitions/Place"
	 *       404:
	 *         description: "place not found"
	 */
	app.delete('/place', async function(req, res) {
		// 1. delete delete mediaArr where placeId = req.placeId with awsUtil
		let params = {};
		let resultObj = {};

		params.Bucket = req.query.memberId;
		params.Prefix = 'placeId/' + req.query.placeId

		awsUtil.deleteFolder(params)
			.then(function (isDeleted) {
				if(isDeleted) {

					Place.deletePlace(req.query.placeId)
						.then(place => {
							resultObj.resultCode = 200;
							resultObj.resultMsg = 'delete success';
							res.status(resultObj.resultCode).send(resultObj);
						})
						.catch(err => {
							resultObj.resultCode = 500;
							resultObj.resultMsg = 'delete fail';
							resultObj.result = err;
							res.status(resultObj.resultCode).send(resultObj);
						});

				} else {

				}

			});

	});

	/**
	 * @swagger
	 * paths: 
	 *  /member:
	 *    get:
	 *      tags:
	 *      - "member"
	 *      summary: "get member list"
	 *      description: "get member list"
	 *      produces:
	 *      - "apllication/json"
	 *      parameters:
	 *      - name: "memberId"
	 *        in: "query"
	 *        description: "member id"
	 *        type: "string"
	 *        required: false
	 *      - name: "nickName"
	 *        in: "query"
	 *        description: "nickname"
	 *        type: "string"
	 *        required: false
	 *      - name: "profileImage"
	 *        in: "query"
	 *        description: "profile image link"
	 *        type: "string"
	 *        required: false
	 *      - name: "thumbnailImage"
	 *        in: "query"
	 *        description: "thumbnail Image"
	 *        type: "string"
	 *        required: false 
	 *      - name: "ageRange"
	 *        in: "query"
	 *        description: "age range"
	 *        type: "string"
	 *        required: false
	 *      - name: "gender"
	 *        in: "query"
	 *        description: "gender"
	 *        type: "string"
	 *        required: false
	 *      - name: "email"
	 *        in: "query"
	 *        description: "email address"
	 *        type: "string"
	 *        required: false
	 *      - name: "auth"
	 *        in: "query"
	 *        description: "write authentification"
	 *        type: "string"
	 *        required: false
	 *      - name: "pageSize"
	 *        in: "query"
	 *        description: "page size"
	 *        type: "query"
	 *        format: "Number"
	 *      - name: "curPage"
	 *        in: "query"
	 *        description: "current page"
	 *        type: "query"
	 *        format: "Number"
	 *      responses:
	 *        200:
	 *          description: "get member list success.\n file url : https://madori3.s3.ap-northeast-2.amazonaws.com/ + fileId"
	 *          schema:
	 *            $ref: "#/definitions/Member"
	 */

	app.get('/member', async function(req, res) {
		let searchCondition = req.query
		let pageSize = 10;
		let curPage = 1;

		if (searchCondition.pageSize !== undefined) {
			pageSize = searchCondition.pageSize;
			searchCondition.pageSize = undefined;
		}
		if (searchCondition.curPage !== undefined) {
			curPage = searchCondition.curPage;
			searchCondition.curPage = undefined;
		}
		let resultObj = {};


		Member.find(
			searchCondition
		)
		.sort({'regDate': -1})
		.skip( (curPage-1) * pageSize)
		.limit(pageSize)
		.exec(function(err, placeList) {
			if(err) {
				resultObj.resultCode = 500;
				resultObj.resultMsg = 'fail';
				resultObj.result = err;
				res.status(500).send(resultObj);
			}
			resultObj.resultCode = 200;
			resultObj.resultMsg = 'success';
			resultObj.pageSize = pageSize;
			resultObj.result = placeList;
			res.status(200).send(resultObj);
		});
		
	});

	/**
	 * @swagger
	 * /member:
	 *   post:
	 *     tags: 
	 *     - "member"
	 *     summary: "create member"
	 *     description: "create member"
	 *     consumes:
	 *     - "application/x-www-form-urlencoded"
	 *     parameters:
	 *     - name: "memberId"
	 *       in: "formData"
	 *       description: "member id"
	 *       type: "string"
	 *       required: true 
	 *     - name: "nickName"
	 *       in: "formData"
	 *       description: "nickname"
	 *       type: "string"
	 *       required: false
	 *     - name: "profileImage"
	 *       in: "formData"
	 *       description: "profile image link"
	 *       type: "string"
	 *       required: false
	 *     - name: "thumbnailImage"
	 *       in: "formData"
	 *       description: "thumbnail Image"
	 *       type: "string"
	 *       required: false 
	 *     - name: "ageRange"
	 *       in: "formData"
	 *       description: "age range"
	 *       type: "string"
	 *       required: false
	 *     - name: "gender"
	 *       in: "formData"
	 *       description: "gender"
	 *       type: "string"
	 *       required: false
	 *     - name: "email"
	 *       in: "formData"
	 *       description: "email address"
	 *       type: "string"
	 *       required: false
	 *     - name: "auth"
	 *       in: "formData"
	 *       description: "write authentification"
	 *       type: "string"
	 *       required: false
	 *     responses:
	 *       200:
	 *         description: "post member success"
	 *         schema:
	 *           $ref: "#/definitions/Member"
	 */

	app.post('/member', async function(req, res) {
		let member = req.body;
		let resultObj = {};

		let params = {
			Bucket : member.memberId,
			/*ACL : 'public-read-write',
			CreateBucketConfiguration : {
				LocationConstraint : 'ap-northeast-2'
			}*/
		};

		S3.createBucket(params, function(err, data) {
			if (err) console.log(err, err.stack);
			else	{
				Member.createMember(member).then( function(data) {
					resultObj.resultCode = 200;
					resultObj.resultMsg = 'success';
					resultObj.memberId = data.memberId;
					res.status(200).send(resultObj);
				}).catch(function (err) {
					res.status(500).send(err);
				});	// catch
			}
		});

		/*let member = req.body;
		let resultObj = {};

		Member.createMember(member).then( function(data) {
			resultObj.resultCode = 200;
			resultObj.resultMsg = 'success';
			resultObj.memberId = data.memberId;
			res.status(200).send(resultObj);
		}).catch(function (err) {
			res.status(500).send(err);
		});*/
	});

	/**
	 * @swagger
	 * /member:
	 *   put:
	 *     tags:
	 *     - "member"
	 *     summary: "update member"
	 *     description: "update member"
	 *     consumes:
	 *     - "application/x-www-form-urlencoded"
	 *     parameters:
	 *     - name: "memberId"
	 *       in: "formData"
	 *       description: "member id"
	 *       type: "string"
	 *       required: true
	 *     - name: "nickName"
	 *       in: "formData"
	 *       description: "nickname"
	 *       type: "string"
	 *       required: false
	 *     - name: "profileImage"
	 *       in: "formData"
	 *       description: "profile image"
	 *       type: "string"
	 *       required: false
	 *     - name: "thumbnailImage"
	 *       in: "formData"
	 *       description: "thumbnail image"
	 *       type: "string"
	 *       required: false
	 *     - name: "ageRange"
	 *       in: "formData"
	 *       description: "age range"
	 *       type: "string"
	 *       required: false
	 *     - name: "gender"
	 *       in: "formData"
	 *       description: "member's gender"
	 *       type: "string"
	 *       required: false
	 *     - name: "email"
	 *       in: "formData"
	 *       description: "email address"
	 *       type: "string"
	 *       required: false
	 *     - name: "auth"
	 *       in: "formData"
	 *       description: "write authentification"
	 *       type: "string"
	 *       required: false
	 *     responses:
	 *       200:
	 *         description: "update member success"
	 *         schema:
	 *           $ref: "#/definitions/Member"
   */
	app.put('/member', async function(req, res) {
		let resultObj = {};
		let member = req.body;

		Member.updateMember(member.memberId, member)
			.then(function (member) {
				resultObj.resultCode = 200;
				resultObj.resultMsg = 'success';
				resultObj.result = member;
				res.status(resultObj.resultCode).send(resultObj);
			})
			.catch(function (err) {
				resultObj.resultCode = 500;
				resultObj.resultMsg = 'fail';
				resultObj.result = err;
				res.status(resultObj.resultCode).send(resultObj);
			});
	});

	/**
	 * @swagger
	 * /member:
	 *   delete:
	 *     tags:
	 *     - "member"
	 *     summary: "delete member"
	 *     description: "delete member"
	 *     produces:
	 *     - 'application/json'
	 *     parameters:
	 *     - name: "memberId"
	 *       in: "query"
	 *       description: "member id"
	 *       type: "string"
	 *       required: true
	 *     responses:
	 *       200:
	 *         description: "delete member success"
	 *         schema:
	 *           $ref: "#/definitions/Member"
	 *       404:
	 *         description: "member not found"
	 */
	app.delete('/member', async function(req, res) {
		/*let params = {
			Bucket : req.query.memberId
		};*/

		Member.deleteMember(req.query.memberId)
			.then(data => {
				res.status(200).send('delete member success');
			})
			.catch(err => {
				res.status(500).send('delete member failed');
			});

		/*awsUtil.deleteFolder(params)
			.then(function (isDeleted) {
					if(isDeleted) {
						awsUtil.deleteBucket(params)
							.then(function (isDeleted) {
								if(isDeleted) {
									Member.deleteMember(req.query.memberId)
										.then(data => {
											res.status(200).send('delete member success');
										})
										.catch(err => {
											res.status(500).send('delete member failed');
										});
								} else {
									res.status(500).send('awsUtil deleteBucket error');
								}
							});
					} else {
						res.status(500).send('awsUtil deleteFolder error');
					}
			});*/

	});
}
