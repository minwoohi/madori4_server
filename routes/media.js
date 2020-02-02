var express = require('express');
var router = express.Router();
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');

const awsUtil = require('../utils/awsUtil');
const multiparty = require('multiparty');

	/**
	 * @swagger
	 * paths: 
	 *  /media:
	 *    get:
	 *      tags:
	 *      - "media"
	 *      summary: "get media list"
	 *      description: "get media list"
	 *      produces:
	 *      - "apllication/json"
	 *      parameters:
	 *      - name: "mediaId"
	 *        in: "query"
	 *        description: "media file id"
	 *        type: "string"
	 *        required: false
	 *      - name: "memberId"
	 *        in: "query"
	 *        description: "member id"
	 *        type: "string"
	 *        required: true
	 *      - name: "placeId"
	 *        in: "query"
	 *        description: "placeId"
	 *        type: "string"
	 *        required: false
	 *      - name: "reviewId"
	 *        in: "query"
	 *        description: "review id"
	 *        type: "string"
	 *        required: false
	 *      - name: "fileName"
	 *        in: "query"
	 *        description: "file real name"
	 *        type: "string"
	 *        required: false 
	 *      - name: "filePath"
	 *        in: "query"
	 *        description: "file path in aws"
	 *        type: "string"
	 *        required: false
	 *      - name: "fileUrl"
	 *        in: "query"
	 *        description: "file URL"
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
	 *          description: "get media list success.\n file url : https://madori3.s3.ap-northeast-2.amazonaws.com/ + fileId"
	 *          schema:
	 *            $ref: "#/definitions/Media"
	 */

	// for AWS S3 file management
	let bucketName = 'madori3';
	const AWS = require('aws-sdk');
	AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
	const S3 = new AWS.S3();

	var upload = multer({
		storage : multerS3({
			s3 : S3,
			//bucket : 'madori4',
			bucket : function (req, file, cb) {
				cb (null, req.body.memberId);
			},
			acl : 'public-read-write',
			metadata : function (req, file, cb) {
				cb (null, {fieldName : file.fieldname});
			},
			contentType: multerS3.AUTO_CONTENT_TYPE,
			key : function (req, file, cb) {
				let extension = path.extname(file.originalname);
				let pre = '';
				if(req.body.placeId !== undefined) {
					//pre = req.body.reviewId + '/';
					pre = req.body.placeId + '/';
				} 
				if (req.body.reviewId !== undefined) {
					//pre = req.body.placeId + '/';
					pre = pre + req.body.reviewId + '/';
				} else {
					console.log('prefix error');
				}
				cb (null, pre + Date.now().toString() + extension);
			}
		})// multerS3
	});	// multer

	router.get('/media', async function(req, res) {
		let params = {};

		params.Bucket = req.query.memberId;
		if(req.query.reviewId !== undefined) {
			params.Prefix = req.query.reviewId;
		} else if (req.query.placeId !== undefined) {
			params.Prefix = req.query.placeId;
		} /*else {
			res.status(500).send('prefix error');
		}*/

		awsUtil.getObjects(params)
			.then(function (data) {
				res.status(200).send(data);
			});

	});

	/**
	 * @swagger
	 * paths: 
	 *  /media:
	 *    post:
	 *      tags:
	 *      - "media"
	 *      summary: "create media file"
	 *      description: "create media file"
	 *      produces:
	 *      - "multipart/form-data"
	 *      parameters:
	 *      - name: "memberId"
	 *        in: "formData"
	 *        description: "memberId (bucket id)"
	 *        type: "string"
	 *        required: true 
	 *      - name: "placeId"
	 *        in: "formData"
	 *        description: "placeId"
	 *        type: "string"
	 *        required: false
	 *      - name: "reviewId"
	 *        in: "formData"
	 *        description: "review id"
	 *        type: "string"
	 *        required: false
	 *      - name: "media"
	 *        in: "formData"
	 *        description: "upload file. make this parameter's order last"
	 *        type: "file"
	 *        required: true
	 *      responses:
	 *        200:
	 *          description: "create media file list success.\n file url : https://madori3.s3.ap-northeast-2.amazonaws.com/ + fileId"
	 *          schema:
	 *            $ref: "#/definitions/Media"
	 */

	router.post('/media', upload.array('media', 8), async function(req, res) {
		res.status(200).send(JSON.stringify(req.files));
		/*const uuid = require('uuid/v1');
		const path = require('path');
		const moment = require('moment');
		let form = new multiparty.Form();

		form.on('field', function(name, value){
			console.log('name : ' + name);
			console.log('value : ' + value);
		});

		form.on('part', function(file){
			console.log('json file : ' + JSON.stringify(file));
				
			let filename;
			let size;
			let exet;

			file.resume();
			
			if(file.filename) {
				filename = file.filename;
				exet = path.extname(filename);
			} else {
				file.resume();
			}


			file.on('end', function(){
				console.log('file info read end...');
			});

		});

		form.on('close', function(){
			console.log('form on close');
			res.status(200).send('post image file success');
		});

		form.parse(req);*/

	});

	/**
	 * @swagger
	 * paths: 
	 *  /media:
	 *    put:
	 *      tags:
	 *      - "media"
	 *      summary: "update media file"
	 *      description: "update media file"
	 *      produces:
	 *      - "multipart/form-data"
	 *      parameters:
	 *      - name: "mediaId"
	 *        in: "formData"
	 *        description: "file id"
	 *        type: "string"
	 *        required: true 
	 *      - name: "mediaFile"
	 *        in: "formData"
	 *        description: "upload file"
	 *        type: "file"
	 *        required: true
	 *      - name: "placeId"
	 *        in: "formData"
	 *        description: "placeId"
	 *        type: "string"
	 *        required: false
	 *      - name: "reviewId"
	 *        in: "formData"
	 *        description: "review id"
	 *        type: "string"
	 *        required: false
	 *      - name: "fileName"
	 *        in: "formData"
	 *        description: "file real name"
	 *        type: "string"
	 *        required: false 
	 *      - name: "filePath"
	 *        in: "formData"
	 *        description: "file path in aws"
	 *        type: "string"
	 *        required: false
	 *      - name: "fileUrl"
	 *        in: "formData"
	 *        description: "file URL"
	 *        type: "string"
	 *        required: false
	 *      responses:
	 *        200:
	 *          description: "create media file success."
	 *          schema:
	 *            $ref: "#/definitions/Media"
	 */

	router.put('/media', async function(req, res) {
		res.status(200).send('put image file success');
	});

	/**
	 * @swagger
	 * /media:
	 *   delete:
	 *     tags:
	 *     - "media"
	 *     summary: "delete media file"
	 *     description: "delete media file"
	 *     produces:
	 *     - 'application/json'
	 *     parameters:
	 *     - name: "memberId"
	 *       in: "formData"
	 *       description: "member id(bucket id)"
	 *       type: "string"
	 *       required: true
	 *     - name: "mediaArr"
	 *       in: "formData"
	 *       description: "media file id... Objects : [{Key : \"objectKey1\"}, {Key : \"objectKey2\"}, ...]"
	 *       type: "string"
	 *       required: false
	 *     - name: "placeId"
	 *       in: "formData"
	 *       description: "place id"
	 *       type: "string"
	 *       required: false
	 *     - name: "reviewId"
	 *       in: "formData"
	 *       description: "review id"
	 *       type: "string"
	 *       required: false
	 *     responses:
	 *       200:
	 *         description: "delete media file success"
	 *         schema:
	 *           $ref: "#/definitions/Media"
	 *       404:
	 *         description: "media file not found"
	 */
	router.delete('/media', async function(req, res) {
		let pre;
		let params = {};
		
		params.Bucket = req.body.memberId;

		if(req.body.mediaArr !== undefined) {
			params.Delete = {};
			params.Delete.Objects = req.body.mediaArr
		} 
		
		if(req.body.placeId !== undefined) {
			pre = req.body.placeId + '/';
			params.Prefix = pre;
		}
		if (req.body.reviewId !== undefined) {
			pre = pre + req.body.reviewId;
			params.Prefix = pre;
		} 

		
		if(pre !== undefined) {	// prefix exists... use awsUtil.deleteFolder
			awsUtil.deleteFolder(params)
				.then(function (isDeleted) {
					if(isDeleted) {
						res.status(200).send('awsUtil.deleteFolder success');
					} else {
						res.status(500).send('deleteFOlder error');
					}
				});
		} else {	// prefix is not exists... delete mediaArr
			S3.deleteObjects(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
					res.status(500).send('deleteObjects err : ' + err.stack);
				} else {
					res.status(200).send('delete media file success');
				}
			});
		}
	});

module.exports = router;
